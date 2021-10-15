import { useEffect, useState } from 'react';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/animations/scale.css';
import 'tippy.js/dist/tippy.css';

const transformData = (data) => {
    const modifiedData = data?.[0]?.trends?.map(({ name, tweet_volume }) => ({
        text: name,
        size: 10 + Math.random() * 90,
        value: tweet_volume,
    }));
    return modifiedData;
};

const Trends = () => {
    const [trendsData, setTrendsData] = useState([]);
    const [appState, setAppState] = useState({ loading: true, error: false });

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

    if (appState.loading) return <>Loading...</>;
    if (appState.error) return <>Error...</>;
    return (
        <ReactWordcloud
            callbacks={{
                getWordTooltip: (word) => word.value,
            }}
            options={{
                fontSizes: [20, 40],
            }}
            size={[window.innerWidth, window.innerHeight - 54]}
            words={trendsData}
        />
    );
};

export default Trends;
