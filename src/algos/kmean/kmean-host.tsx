import React from 'react';
import { calcKmean } from './kmean';

const KMeanHost: React.FC = () => {

    const handleCalc = () => {
        const data: Array<Array<number>> = [
            [1,2],[2,1],[2,3],[3,2],[4,3],[5,5]
        ];
        calcKmean(data, 2);
    };

    return (
        <div>
            <button onClick={handleCalc}>Calculate</button>
        </div>
    );
}

export default KMeanHost;
