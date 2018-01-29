import {Component,OnInit,Input} from '@angular/core';
import {HttpDataService} from '../../../../service/http.service';
import {MessageService} from "../../../../service/message.service";


@Component({
    selector: 'bubble-chart',
    templateUrl: './bubble-chart.html',
})
export class bubbleChartComponent {
    data:any[]=[];
    data1:any[]=[];
    data2:any[]=[];
    data3:any[]=[];
    chartOption:any;
    @Input () childData:any;
    titleTime:any;
    titleTime1:any;
    constructor(private httpService: HttpDataService, private msgService: MessageService) {}
    ngOnInit() {
        let time = this.childData.meetingDate;
        let Y = new Date(time).getFullYear();
        let M = new Date(time).getMonth()+1;
        let D = new Date(time).getDate();
        if(M<3){
            this.titleTime = Y+"年"+'1季度';
            this.titleTime1 = Y+' Q1';
        }
        else if(M<6){
            this.titleTime = Y+"年"+'2季度';
            this.titleTime1 = Y+' Q2';
        }
        else if(M<9){
            this.titleTime = Y+"年"+'3季度';
            this.titleTime1 = Y+' Q3';
        }
        else{
            this.titleTime = Y+"年"+'4季度';
            this.titleTime1 = Y+' Q4';
        }
        var echarts = require('echarts');
        this.httpService.post("/bpd-proj/bpd/programScorecard/getArray",{
            // "reportDate":this.childData
            "reportSeason":this.childData.selectedMeeting
        }).subscribe(data => {
            for(let i=0;i<data.length;i++){
                if(data[i][3] == 1){
                    this.data1.push(data[i]);
                }
                else if(data[i][3] == 2){
                    this.data2.push(data[i]);
                }
                else if(data[i][3] == 3){
                    this.data3.push(data[i]);
                }
            }
            this.chartOption =  {
                // backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
                //     offset: 0,
                //     color: '#f7f8fa'
                // }, {
                //     offset: 1,
                //     color: '#cdd0d5'
                // }]),
                title: {
                    text: this.titleTime+' 净现值/边际利润率/销量状态图',
                    subtext: this.titleTime1+' NPV/CM/Volume Status Summary',
                    left: 'center'
                },
                legend: {
                    right: 10,
                    data: ['CSO-IV', 'PPV-SORP','IV-PPV']
                },
                xAxis: {
                    type: 'value',
                    name: 'CM',
                    nameGap: 10,
                    axisLabel: {
                        formatter: '{value}%'
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'NPV',
                    nameGap: 10,
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    scale: true
                },
                series: [{
                    name: 'CSO-IV',
                    data: this.data1,
                    type: 'scatter',
                    symbolSize: function (data) {
                        return data[2]/2+40*(data[2]>0?1:0);
                    },
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[4]+'\n'+param.data[0]+'%'+','+param.data[1];
                            },
                            position: 'top'
                        },
                        normal:{
                            show:true,
                            formatter:function(param){
                                return param.data[4];
                            },
                            position: 'inside'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(102, 127, 157, 0.5)',
                            shadowOffsetY: 5,
                            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                                offset: 0,
                                color: 'rgb(120, 130, 200)'
                            }, {
                                offset: 1,
                                color: 'rgb(100, 110, 140)'
                            }])
                        }
                    }
                }, {
                    name: 'PPV-SORP',
                    data: this.data2,
                    type: 'scatter',
                    symbolSize: function (data) {
                        return data[2]/2+40*(data[2]>0?1:0);
                        // return data[2];
                    },
                    label: {
                        emphasis:{
                            show: true,
                            formatter: function (param) {
                                return param.data[4]+'\n'+param.data[0]+'%'+','+param.data[1];
                            },
                            position: 'top'
                        },
                        normal:{
                            show:true,
                            formatter:function(param){
                                return param.data[4];
                            },
                            position: 'inside'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(143, 160, 109, 0.5)',
                            shadowOffsetY: 5,
                            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                                offset: 0,
                                color: 'rgb(170, 206, 97)'
                            }, {
                                offset: 1,
                                color: 'rgb(74, 99, 24)'
                            }])
                        }
                    }
                },
                {
                    name: 'IV-PPV',
                    data: this.data3,
                    type: 'scatter',
                    symbolSize: function (data) {
                        return data[2]/2+40*(data[2]>0?1:0);
                    },
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[4]+'\n'+param.data[0]+'%'+','+param.data[1];
                            },
                            position: 'top'
                        },
                        normal:{
                            show:true,
                            formatter:function(param){
                                return param.data[4];
                            },
                            position: 'inside'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(202, 64, 60, 0.5)',
                            shadowOffsetY: 5,
                            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                                offset: 0,
                                color: 'rgb(236,126,122)'
                            }, {
                                offset: 1,
                                color: 'rgb(131,44,42)'
                            }])
                        }
                    }
                }]
            };
        })
    }
}