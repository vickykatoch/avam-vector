const { Command, Client } = require('amps');
const data = require('./data/trsy-prices.json');

const getClient = async () => {
    try {
        const CONNECTION_NAME = 'TSRY-DATA-LOADER';
        const client = new Client(CONNECTION_NAME);
        const message = await client.connect('ws://avam-ubnt:9028/amps/json');
        console.log(message);
        return client;
    } catch (err) {
        console.error(err);
    }
    return undefined;
};

const publish = (payload, client) => {
    return new Promise(async (resolve, reject) => {
        const cmd = new Command('publish').topic('/prices/trsy').ackType('processed').data(payload);
        await client.execute(cmd, (message) => {
            const { c, status, reason } = message;
            if (c === 'ack' && status === 'success') {
                resolve(true);
            } else {
                reject(reason);
            }
        }, 3000);
    });
};

const waitTs = (n) => new Promise(resolve => setTimeout(resolve, n));
function generateRandomInt(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}
const publishRandom = async (client) => {
    console.log('Ramdom Publish');
    const item = data[generateRandomInt(0, data.length - 1)];
    item.Time = Date.now();
    item.High = data[generateRandomInt(0, data.length - 1)].High;
    item.Low = data[generateRandomInt(0, data.length - 1)].Low;
    item.Open = data[generateRandomInt(0, data.length - 1)].Open;
    item.Last = data[generateRandomInt(0, data.length - 1)].Last;
    item.Chg = data[generateRandomInt(0, data.length - 1)].Chg;
    item.Volume = data[generateRandomInt(0, data.length - 1)].Volume;
    try {
        await publish(item, client);
    } catch (err) {
        console.error('Random Publish Error', err.message);
    }
};
const start = async () => {
    const client = await getClient();
    for (const [index, item] of data.entries()) {
        try {
            console.log('Publishing from file');
            item.Time = (new Date(item.Time)).getTime();
            await publish(item, client);
        } catch (err) {
            console.error(`Item# [${index}] failed to publish, [${err.message}]`, item);
        }
    }
    setInterval(() => publishRandom(client), 500);
};

start();

