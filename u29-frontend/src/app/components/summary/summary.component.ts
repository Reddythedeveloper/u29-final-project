import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DataService } from '../../services/data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
  private data: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getChart1Data().subscribe({
      next: (res) => {
        this.data = res;
        this.createChart();
      },
      error: (err) => console.error(err)
    });
  }

  private createChart(): void {
    const element = document.getElementById('chart1');
    if (!element) return;

    // Clean up any existing chart
    d3.select(element).selectAll('*').remove();

    // Dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // SVG Container
    const svg = d3.select(element).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Axis
    const x = d3.scaleBand()
      .range([0, width])
      .domain(this.data.map(d => d.label))
      .padding(0.2);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .style('font-size', '16px')
      .call(d3.axisBottom(x));

    // Y Axis
    const y = d3.scaleLinear()
      .domain([0, 30]) // Max efficiency around 30%
      .range([height, 0]);

    svg.append('g')
      .style('font-size', '16px')
      .call(d3.axisLeft(y));

    // Bars
    svg.selectAll('mybar')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d.label)!)
      .attr('y', (d: any) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => height - y(d.value))
      .attr('fill', '#007bff');

    // Labels
    svg.selectAll('.text')
      .data(this.data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d: any) => x(d.label)! + x.bandwidth() / 2)
      .attr('y', (d: any) => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text((d: any) => d.value + '%');
  }
}
