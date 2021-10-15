import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { useCallback, useEffect, useState } from 'react';

const transformData = (data) => {
    const modifiedData = data?.[0]?.trends?.map(({ name, tweet_volume }) => ({
        text: name,
        size: 10 + Math.random() * 90,
    }));
    return modifiedData;
};

const Trends = () => {
    const [trendsData, setTrendsData] = useState([]);
    const [appState, setAppState] = useState({ loading: true, error: false });

    const layout = cloud()
        .size([960, 500])
        .words(trendsData)
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font('Impact')
        .fontSize((d) => d.size)
        .on('end', (words) => console.log(JSON.stringify(words)));

    const draw = useCallback(() => {
        d3.select('body')
            .append('svg')
            .attr('width', layout.size()[0])
            .attr('height', layout.size()[1])
            .append('g')
            .attr(
                'transform',
                'translate(' +
                    layout.size()[0] / 2 +
                    ',' +
                    layout.size()[1] / 2 +
                    ')'
            )
            .selectAll('text')
            .data(trendsData)
            .enter()
            .append('text')
            .style('font-size', function (d) {
                return d.size + 'px';
            })
            .style('font-family', 'Impact')
            .attr('text-anchor', 'middle')
            .attr('transform', function (d) {
                return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
            })
            .text(function (d) {
                return d.text;
            });
    }, [trendsData, layout]);

    useEffect(() => {
        async function Init() {
            try {
                fetch('http://localhost:3001/api/trending')
                    .then((res) => res.json())
                    .then((response) => {
                        setTrendsData(transformData(response));
                        setAppState({ loading: false, error: false });
                    });
            } catch (e) {
                setAppState({ loading: false, error: true });
                console.log(e);
            }
        }

        Init();
    }, []);

    useEffect(() => {
        if (trendsData.length) {
            layout.start();
            draw();
        }
    }, [trendsData]);

    if (appState.loading) {
        return <>Loading...</>;
    }
    if (appState.error) {
        return <>Error</>;
    }
    return <span />;
};

export default Trends;
