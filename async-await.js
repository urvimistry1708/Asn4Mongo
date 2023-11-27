const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/';

function findAll() {

    return new Promise(async (resolve, reject) => {
        const client = new MongoClient(url);
        await client.connect({ useNewUrlParser: true, useUnifiedTopology: true })
            .catch(err => { console.log("s2"); console.log(err); });

        if (!client) return;
        try {
            console.log('1');
            const db = client.db("mydb");
            console.log('2');

            let collection = db.collection('customers');
            console.log('3');

            let cursor = collection.find({}).limit(10);
            console.log('4');

            await cursor.forEach(doc => console.log(doc));
            console.log('5');

            resolve();
        } catch (err) {
            reject(err);
        } finally {
            client.close();
        }
    });
}

setTimeout(async () => {
    try {
        await findAll();
        console.log('iter');
    } catch (err) {
        console.error(err);
    }
}, 5000);