// Global vars
var sales_options;
var sales_chart;
var profit_chart;
var profit_options;

// Highchart Style
Highcharts.theme = {
    colors:"#2b908f #90ee7e #f45b5b #7798BF #aaeeee #ff0066 #eeaaee #55BF3B #DF5353 #7798BF #aaeeee".split(" "),
    chart: {
        backgroundColor: 'rgba(0, 0, 0, 0.20)',
        style: {
            fontFamily: "'Unica One', sans-serif"
        },
        plotBorderColor:"#606063"
    },
    title: {
        style: {
            color: "#E0E0E3",
            textTransform: "uppercase",
            fontSize: "20px"
        }
    },
    subtitle: {
        style: {
            color: "#E0E0E3",
            textTransform: "uppercase"
        }
    },
    xAxis: {
        gridLineColor:"#707073",
        labels: {
            style: {
                color: "#E0E0E3"
            }
        },
        lineColor:"#707073",
        minorGridLineColor:"#505053",
        tickColor:"#707073",
        title: {
            style: {
                color: "#A0A0A3"
            }
        }
    },
    yAxis: {
        gridLineColor:"#707073",
        labels: {
            style: {
                color: "#E0E0E3"
            }
        },
        lineColor:"#707073",
        minorGridLineColor:"#505053",
        tickColor:"#707073",
        tickWidth:1,
        title: {
            style: {
                color: "#A0A0A3"
            }
        }
    },
    tooltip: {
        backgroundColor:"rgba(0, 0, 0, 0.85)",
        style: {
            color: "#F0F0F0"
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: "#B0B0B3"
            },
            marker: {
                lineColor: "#333"
            }
        },
        boxplot: {
            fillColor: "#505053"
        },
        candlestick: {
            lineColor: "white"
        },
        errorbar: {
            color: "white"
        }
    },
    legend: {
        itemStyle: {
            color: "#E0E0E3"
        },
        itemHoverStyle: {
            color: "#FFF"
        },
        itemHiddenStyle: {
            color: "#606063"
        }
    },
    credits: {
        enabled: false,
        style: {
            color: "#666"
        }
    },
    labels: {
        style: {
            color: "#707073"
        }
    },
    drilldown: {
        activeAxisLabelStyle: {
            color: "#F0F0F3"
        },
        activeDataLabelStyle: {
            color: "#F0F0F3"
        }
    },
    navigation: {
        buttonOptions: {
            symbolStroke:"#DDDDDD",
            theme: {
                fill: "#505053"
            }
        }
    },
    rangeSelector: {
        buttonTheme: {
            fill:"#505053",
            stroke:"#000000",
            style: {
                color: "#CCC"
            },
            states: {
                hover: {
                    fill:"#707073",
                    stroke:"#000000",
                    style: {
                        color: "white"
                    }
                },
                select: {
                    fill:"#000003",
                    stroke:"#000000",
                    style: {
                        color: "white"
                    }
                }
            }
        },
        inputBoxBorderColor:"#505053",
        inputStyle: {
            backgroundColor: "#333",
            color: "silver"
        },
        labelStyle: {
            color: "silver"
        }
    },
    navigator: {
        handles: {
            backgroundColor: "#666",
            borderColor: "#AAA"
        },
        outlineColor:"#CCC",
        maskFill:"rgba(255,255,255,0.1)",
        series: {
            color: "#7798BF",
            lineColor: "#A6C7ED"
        },
        xAxis: {
            gridLineColor: "#505053"
        }
    },
    scrollbar: {
        barBackgroundColor: "#808083",
        barBorderColor: "#808083",
        buttonArrowColor: "#CCC",
        buttonBackgroundColor: "#606063",
        buttonBorderColor: "#606063",
        rifleColor: "#FFF",
        trackBackgroundColor: "#404043",
        trackBorderColor: "#404043"
    },
    legendBackgroundColor:"rgba(0, 0, 0, 0.5)",
    background2:"#505053",
    dataLabelsColor:"#B0B0B3",
    textColor:"#C0C0C0",
    contrastTextColor:"#F0F0F3",
    maskColor:"rgba(255,255,255,0.3)"
};

Highcharts.setOptions(Highcharts.theme);
// /Highchart Style

// Profit chart
function requestProfitData() {
    $.getJSON('/json/bar_profit_data/', function(data) {
        profit_options.series[0]['data'] = data;

        profit_chart = new Highcharts.stockChart(profit_options);
    });

    // call it again after 5 minutes
    setTimeout(requestProfitData, 300000);
}

$(document).ready(function() {
    // create the chart
    profit_options = {
        chart: {
            renderTo: 'profit-chart',
            alignTicks: false
        },

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AIOFlipper Profit Visualisation'
        },

        series: [
            {
                type: 'column',
                name: 'Profit',
                data: [],
                dataGrouping: {
                    units: [[
                        'week', // unit name
                        [1] // allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]]
                }
            }
        ]
    };

    requestProfitData();

});
// /Profit chart



// Sales chart

function requestSalesData() {
    $.getJSON('/json/scatter_sales_data/', function(data) {
        for (var i = 0; i < data.length; i++) {
            sales_options.series[i]['data'] = data[i];
        }

        // quickstats widgets
        requestWidgetsQuickstatsData();
        // /quickstats widgets

        sales_chart = new Highcharts.chart(sales_options);
    });

    // call it again after five minutes
    setTimeout(requestSalesData, 300000);
}

$(document).ready(function() {

    sales_options = {
        chart: {
            renderTo: 'sales-chart',
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Item sales by Item'
        },
        subtitle: {
            text: 'Today',
        },
        xAxis: {
            title: {
                enabled: false,
                text: ''
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            labels:
            {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'Profit (K)'
            },
            labels:
            {
                enabled: true
            }
        },
        legend: {
            enabled: false,
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    symbol: 'diamond',
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: 'Profit: {point.y} gp'
                }
            }
        },
        series: 
        [
            {
                name: 'Anima Core body of Seren',
                color: 'rgba(223, 83, 83, 0.3)',
            },
            {
                name: 'Anima Core body of Sliske',
                color: 'rgba(221, 84, 85, 0.3)',
            },
            {
                name: 'Anima Core body of Zamorak',
                color: 'rgba(219, 85, 87, 0.3)',
            },
            {
                name: 'Anima Core Body of Zaros',
                color: 'rgba(217, 86, 89, 0.3)',
            },
            {
                name: 'Anima Core helm of Seren',
                color: 'rgba(215, 88, 91, 0.3)',
            },
            {
                name: 'Anima Core helm of Sliske',
                color: 'rgba(213, 89, 93, 0.3)',
            },
            {
                name: 'Anima Core helm of Zamorak',
                color: 'rgba(211, 90, 95, 0.3)',
            },
            {
                name: 'Anima Core helm of Zaros',
                color: 'rgba(209, 92, 97, 0.3)',
            },
            {
                name: 'Anima Core legs of Seren',
                color: 'rgba(207, 93, 99, 0.3)',
            },
            {
                name: 'Anima Core legs of Sliske',
                color: 'rgba(205, 94, 101, 0.3)',
            },
            {
                name: 'Anima Core legs of Zamorak',
                color: 'rgba(203, 96, 103, 0.3)',
            },
            {
                name: 'Anima Core Legs of Zaros',
                color: 'rgba(201, 97, 105, 0.3)',
            },
            {
                name: 'Armadyl boots',
                color: 'rgba(199, 98, 107, 0.3)',
            },
            {
                name: 'Armadyl buckler',
                color: 'rgba(197, 99, 109, 0.3)',
            },
            {
                name: 'Armadyl chainskirt',
                color: 'rgba(195, 101, 111, 0.3)',
            },
            {
                name: 'Armadyl chestplate',
                color: 'rgba(193, 102, 113, 0.3)',
            },
            {
                name: 'Armadyl crossbow',
                color: 'rgba(191, 103, 115, 0.3)',
            },
            {
                name: 'Armadyl gloves',
                color: 'rgba(189, 105, 117, 0.3)',
            },
            {
                name: 'Armadyl helmet',
                color: 'rgba(187, 106, 119, 0.3)',
            },
            {
                name: 'Bandos boots',
                color: 'rgba(185, 107, 121, 0.3)',
            },
            {
                name: 'Bandos chestplate',
                color: 'rgba(183, 109, 123, 0.3)',
            },
            {
                name: 'Bandos gloves',
                color: 'rgba(181, 110, 125, 0.3)',
            },
            {
                name: 'Bandos helmet',
                color: 'rgba(179, 111, 127, 0.3)',
            },
            {
                name: 'Bandos tassets',
                color: 'rgba(177, 112, 129, 0.3)',
            },
            {
                name: 'Bandos warshield',
                color: 'rgba(175, 114, 131, 0.3)',
            },
            {
                name: 'Blade of Avaryss',
                color: 'rgba(173, 115, 133, 0.3)',
            },
            {
                name: 'Blade of Nymora',
                color: 'rgba(171, 116, 135, 0.3)',
            },
            {
                name: 'Boots of subjugation',
                color: 'rgba(170, 118, 138, 0.3)',
            },
            {
                name: 'Dragon Rider lance',
                color: 'rgba(168, 119, 140, 0.3)',
            },
            {
                name: 'Garb of subjugation',
                color: 'rgba(166, 120, 142, 0.3)',
            },
            {
                name: 'Gloves of subjugation',
                color: 'rgba(164, 122, 144, 0.3)',
            },
            {
                name: 'Gown of subjugation',
                color: 'rgba(162, 123, 146, 0.3)',
            },
            {
                name: 'Hood of subjugation',
                color: 'rgba(160, 124, 148, 0.3)',
            },
            {
                name: 'Off-hand Armadyl crossbow',
                color: 'rgba(158, 125, 150, 0.3)',
            },
            {
                name: 'Off-hand shadow glaive',
                color: 'rgba(156, 127, 152, 0.3)',
            },
            {
                name: 'Orb of the Cywir elders',
                color: 'rgba(154, 128, 154, 0.3)',
            },
            {
                name: 'Pernix body',
                color: 'rgba(152, 129, 156, 0.3)',
            },
            {
                name: 'Pernix boots',
                color: 'rgba(150, 131, 158, 0.3)',
            },
            {
                name: 'Pernix chaps',
                color: 'rgba(148, 132, 160, 0.3)',
            },
            {
                name: 'Pernix cowl',
                color: 'rgba(146, 133, 162, 0.3)',
            },
            {
                name: 'Pernix gloves',
                color: 'rgba(144, 135, 164, 0.3)',
            },
            {
                name: 'Shadow glaive',
                color: 'rgba(142, 136, 166, 0.3)',
            },
            {
                name: 'Torva boots',
                color: 'rgba(140, 137, 168, 0.3)',
            },
            {
                name: 'Torva full helm',
                color: 'rgba(138, 138, 170, 0.3)',
            },
            {
                name: 'Torva gloves',
                color: 'rgba(136, 140, 172, 0.3)',
            },
            {
                name: 'Torva platebody',
                color: 'rgba(134, 141, 174, 0.3)',
            },
            {
                name: 'Torva platelegs',
                color: 'rgba(132, 142, 176, 0.3)',
            },
            {
                name: 'Virtus boots',
                color: 'rgba(130, 144, 178, 0.3)',
            },
            {
                name: 'Virtus gloves',
                color: 'rgba(128, 145, 180, 0.3)',
            },
            {
                name: 'Virtus mask',
                color: 'rgba(126, 146, 182, 0.3)',
            },
            {
                name: 'Virtus robe legs',
                color: 'rgba(124, 148, 184, 0.3)',
            },
            {
                name: 'Virtus robe top',
                color: 'rgba(122, 149, 186, 0.3)',
            },
            {
                name: 'Wand of the Cywir elders',
                color: 'rgba(120, 150, 188, 0.3)',
            },
            {
                name: 'Ward of subjugation',
                color: 'rgba(119, 152, 191, 0.3)',
            }
        ]
    };

    requestSalesData();
});
// /Sales chart


// Widgets quickstats
function requestWidgetsQuickstatsData() {
    $.getJSON('/json/widget_quickstats_data/', function(data) {
        // "quickstats-widget-total-value"
        // "quickstats-widget-cash-value"
        // "quickstats-widget-items-value"
        // "quickstats-widget-sales-today"

        var $element_total_value = $('#quickstats-widget-total-value h2');
        var $element_cash_value = $('#quickstats-widget-cash-value h2');
        var $element_items_value = $('#quickstats-widget-items-value h2');
        var $element_sales_today = $('#quickstats-widget-sales-today h2');

        $element_total_value.text(Math.round(data[0] / 1000000).toString() + ' M');
        $element_cash_value.text(Math.round(data[1] / 1000000).toString() + ' M');
        $element_items_value.text(Math.round(data[2] / 1000000).toString() + ' M');
        $element_sales_today.text(data[3]);
    });

    // call it again after 5 minutes
    // setTimeout(requestWidgetsQuickstatsData, 300000);
    // Gets called by requestSalesData
}
// /Widgets quickstats