const { Command, Client } = require('amps');
const data = require('./data/trsy-prices.json');
const { writeFileSync } = require('fs');
const { join} = require('path');

const oofedArray = [];
const sanitizeData = () => {
    data.forEach(d => {
        d.Time = (new Date(d.Time)).getTime();
    });
    writeFileSync(join(__dirname,'data/sanitized.json'), JSON.stringify(data, undefined, 5));
};

const getClient = async () => {
    try {
        const CONNECTION_NAME = 'TSRY-DATA-LOADER';
        const client = new Client(CONNECTION_NAME);
        const message = await client.connect('ws://avam-ubnt:9028/amps/json');
        console.log(message);
        // client.sowDelete
        return client;
    } catch (err) {
        console.error(err);
    }
    return undefined;
};

const publish = (payload, client, commandName = 'publish') => {
    return new Promise(async (resolve, reject) => {
        console.log('CommandName : ', commandName);
        if (commandName === 'sow_delete') {
            // const filter = `/Time=${payload.Time}`;
            const result = await client.sowDeleteByData('/prices/trsy', payload);
            console.log(result)
        } else {
            const cmd = new Command(commandName).topic('/prices/trsy').ackType('processed').data(payload);
            await client.execute(cmd, (message) => {
                const { c, status, reason } = message;
                if (c === 'ack' && status === 'success') {
                    resolve(true);
                } else {
                    reject(reason);
                }
            }, 3000);
        }
    });
};

const waitTs = (n) => new Promise(resolve => setTimeout(resolve, n));
function generateRandomInt(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}
const getNew = () => {
    if (oofedArray.length > 10) {
        const index = generateRandomInt(0, oofedArray.length - 1);
        const item = oofedArray.splice(index, 1)[0];
        data.push(item);
        return item;
    } else {
        const item = data[generateRandomInt(0, data.length - 1)];
        item.Time = Date.now();
        item.High = data[generateRandomInt(0, data.length - 1)].High;
        item.Low = data[generateRandomInt(0, data.length - 1)].Low;
        item.Open = data[generateRandomInt(0, data.length - 1)].Open;
        item.Last = data[generateRandomInt(0, data.length - 1)].Last;
        item.Chg = data[generateRandomInt(0, data.length - 1)].Chg;
        item.Volume = data[generateRandomInt(0, data.length - 1)].Volume;
        return item;
    }
}
const getDelete = () => {
    if (data.length) {
        const index = data.length === 1 ? 0 : generateRandomInt(0, data.length - 1);
        const item = data.splice(index, 1)[0];
        oofedArray.push(item);
        return item;
    }
    return undefined;
};
const getUpdate = () => {
    if (data.length) {
        const index = data.length === 1 ? 0 : generateRandomInt(0, data.length - 1);
        const item = data[index];
        item.High += 2;
        item.Low += 2;
        item.Open += 2;
        item.Last += 2;
        item.Volume += 2;
        return item;
    }
    return undefined;
};
const deleteAll = async (client) => {
    await client.sowDelete('/prices/trsy', '1=1');
}
const deleteTemp = async (client) => {
    const items = data[0];
    items.Time = 20;
    const response = await client.sowDeleteByData('/prices/trsy', items);
    console.log(response);
};

const publishRandom = async (client) => {
    console.log('Ramdom Publish');
    const type = generateRandomInt(1, 4);
    try {
        let item;
        let cmdName = 'publish';
        if (type === 1) {
            item = getDelete();
            cmdName = 'sow_delete';
        } else if (type === 2) {
            item = getNew();
        } else {
            console.log('UPDATE');
            item = getUpdate();
        }
        item && await publish(item, client, cmdName);
    } catch (err) {
        console.error('Random Publish Error', err.message);
    }
};
const start = async () => {
    sanitizeData();
    const client = await getClient();
    // deleteTemp(client);

    deleteAll(client);
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

