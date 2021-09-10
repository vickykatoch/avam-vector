import { randomInt } from '../../utils'


export function calcKmean(data: Array<Array<number>>, k: number) {
    const size = data.length-1;
    const centroids=new Array<number>();
    for(let i=0;i<100;i++) {
        const centroid = randomInt(0,size);
        !centroids.includes(centroid) && centroids.push(centroid);
        if(centroids.length===k) break;
    }
    console.log('Centroids : ',centroids);

    const r = data.reduce((acc,num)=> {
        const distance =Array.from(centroids, n=> Math.sqrt((data[n][0] - num[0])**2 + (data[n][1] - num[1])**2))
        const min = Math.min(...distance);
        const index = distance.findIndex(m=> m===min);

        console.log('Distance', distance);
        console.log('Cluster : ', index);
        const clusterName = `Cluster-${index+1}`;
        if(clusterName in acc) {
            acc[clusterName].push(num);
        } else {
            acc[clusterName]=[num];
        }
        return acc;
    },{} as Record<string, Array<Array<number>>>);
    
    console.log(r);
}
