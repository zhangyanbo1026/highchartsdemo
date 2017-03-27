$(function(){   
    $("#search").bind('click',function(){
        var classno = $('#classno').val();
        if (classno=='') 
        {
            return;
        }
        $.ajax({
                url: 'getscoreinfobyclassno',
                type: 'GET',
                dataType: 'json',
                data:"classno="+classno
            }).success(function(data){
                if (data ==-1) {
                    alert('No data');                       
                }
                else{
                    
                    var dataTemp = [];
                    var category = [];
                    var average = [];
                    var totalscore = 0;
                
                    $("#chartarea").show();
                    $('#scoredetail').hide();
                    $.each(data,function(i,item){
                        $.each(item,function(key,value){
                            if(key == 'name')
                            {
                                category.push(value);
                            }
                            else
                            {
                                value = parseFloat(value);
                                totalscore += value;
                                dataTemp.push(value);   
                            }
                        })
                    })
                    
                    var temp=0;
                    var count = [0,0,0,0,0]
                    //
                    temp = totalscore/dataTemp.length;
                    //console.log(totalscore);
                    //console.log(dataTemp.length);
                    for (var i = 0; i < dataTemp.length; i++) {
                        average.push(temp);
                        if (dataTemp[i] >= 90) 
                        {
                           ++count[0]; 
                        }
                        else if(dataTemp[i]>=80)
                        {
                            ++count[1]; 
                        } 
                        else if(dataTemp[i]>=70)
                        {
                            ++count[2]; 
                        } 
                        else if(dataTemp[i]>=60)
                        {
                            ++count[3]; 
                        }else{
                            ++count[4]; 
                        }
                    }
                    var countdata = [
                        ['90-100',count[0]],
                        ['80-90', count[1]],
                        ['70-80',count[2]],
                        ['60-70',count[3]],
                        ['0-60', count[4]]
                    ]
                    
                    paintchart(dataTemp,category,average,countdata);
                    
                    //console.log(countdata);
                    //paintpiechart(countdata);
                    paintcolumncount(count,classno);
                }
            }).error(function() {
                console.log('error');
            })
            .always(function(){
                console.log('done');
            });
    });

    $("#excelexport").bind('click',function(){
        var classno = $('#classno').val();
        if (classno=='') 
        {
            return;
        }
        window.location.href="/index.php/excel/exportExcel?classno="+classno;
    })

    function paintchart(data,category,average,countdata)
    {
        $('#chartarea1').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '成绩统计图'
        },
        xAxis: {
            categories: category,
            labels: {
                    rotation: -45,
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
        },
        yAxis: {
            min: 0,
            title: {
                text: '分数'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
                series: {
                    borderWidth: 1,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}'
                    }
                }
            },
        
        series: [{
            name: '成绩',
            data: data
        },
        {
            type: 'spline',
            name: '平均分',
            data: average,
            marker: {
                lineWidth: 1,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        },
        {
            type: 'pie',
            name: '人数',
            data: countdata,
            center: [20, 20],
            size: 100,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
        });
    }

    function paintpiechart(countdata)
    {
        console.log(countdata);
        $('#pie').highcharts({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        title: {
            text: '成绩/人数分布图'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },
        series: [{
            type: 'pie',
            name: '占总人数',
            data: countdata
            }]
        });
    }

    function paintcolumncount(data,classno)
    {
        $('#columncount').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '成绩/人数分布图'
        },
        xAxis: {
            categories: [
                '100-90',
                '90-80',
                '80-70',
                '70-60',
                '60-0'
                ]
        },
        yAxis: {
            min: 0,
            title: {
                text: '人数'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                events:{
                click:function()
                {
                    var cate = event.point.category;
                    var max = cate.match(/([0-9]+-)/);
                    var min = cate.match(/(-[0-9]+)/);
                    if (max) {
                        max = max[0];
                        }
                    if (min) {
                        min = min[0];
                        }
                    max = max.replace('-', ''); 
                    min = min.replace('-', ''); 
                    //showchartsbyscore(null);
                    if (min>=0 && max>0) 
                    {
                        $.ajax({
                            url: 'getstudentbyminandmaxscore',
                            type: 'GET',
                            dataType: 'json',
                            data:"classno="+classno+"&min="+min+"&max="+max
                        }).success(function(data){
                            var categoryTemp = []
                            var datascoretemp = [];
                            $.each(data,function(i,item){
                                $.each(item,function(key,value){
                                    if(key == 'name')
                                    {
                                        categoryTemp.push(value);
                                    }
                                    else
                                    {
                                        value = parseFloat(value);
                                        datascoretemp.push(value);   
                                    }
                                })
                            })
                            showchartsbyscore(categoryTemp,datascoretemp);
                        }).error(function() {
                            console.log('error');
                        })
                    }
                }
                }
            }
        },
        series: [{
            name: '人数',
            data: data
        }]
    });
    }

    function showchartsbyscore(category,data)
    {   $('#scoredetail').show();
        $('#scoredetail').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '成绩/人数分布图'
            },
            xAxis: {
                categories: category
            },
            yAxis: {
                min: 0,
                title: {
                    text: '人数'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: '成绩',
                data: data
            }]
        });
    }

});