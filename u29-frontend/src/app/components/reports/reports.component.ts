import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DataService } from '../../services/data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getChart2Data().subscribe({
      next: (data) => this.createLineChart(data),
      error: (err) => console.error(err)
    });
  }

  private createLineChart(data: any[]): void {
    // Transform data: We have flat rows, we need to group them by Type (Silicon vs Tandem)
    // Values: 'Standard Silicon' and 'Perovskite Tandem (+20%)' are the descriptions in DB? 
    // Let's check DB... Ah, description column distinguishes them.

    // Let's filter manually for simplicity
    const siliconData = data.filter(d => d.description.includes('Standard'));
    const tandemData = data.filter(d => d.description.includes('Perovskite'));

    const element = document.getElementById('chart2');
    if (!element) return;

    // Make it bigger
    const width = 1000;
    const height = 500;
    const margin = { top: 50, right: 100, bottom: 50, left: 50 };

    const svg = d3.select(element).append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`) // Makes it responsive
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Axis (Years)
    const x = d3.scalePoint()
      .domain(['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'])
      .range([0, width - margin.left - margin.right]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .style('font-size', '16px')
      .call(d3.axisBottom(x));

    // Y Axis (MWh)
    const y = d3.scaleLinear()
      .domain([0, 70])
      .range([height - margin.top - margin.bottom, 0]);

    svg.append('g').style('font-size', '16px').call(d3.axisLeft(y));

    const line = d3.line<any>()
       .x((d: any) => x(d.label)!)
       .y((d: any) => y(d.value));

    // Draw Silicon Line (Grey)
    svg.append('path')
      .datum(siliconData)
      .attr('fill', 'none')
      .attr('stroke', '#7f7f7f')
      .attr('stroke-width', 4)
      .attr('d', line);

    // Draw Tandem Line (Green)
    svg.append('path')
      .datum(tandemData)
      .attr('fill', 'none')
      .attr('stroke', '#28a745')
      .attr('stroke-width', 4)
      .attr('d', line);

    // Legend
    svg.append("circle").attr("cx", 50).attr("cy", 10).attr("r", 6).style("fill", "#7f7f7f");
    svg.append("text").attr("x", 70).attr("y", 15).text("Standard Silicon").style("font-size", "16px").attr("alignment-baseline","middle");
    svg.append("circle").attr("cx", 250).attr("cy", 10).attr("r", 6).style("fill", "#28a745");
    svg.append("text").attr("x", 270).attr("y", 15).text("Perovskite Tandem").style("font-size", "16px").attr("alignment-baseline","middle");
  }
}
