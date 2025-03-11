import { EventEmitter } from 'events';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

if (process.env.VSCODE_INSPECTOR_OPTIONS) {
  jest.setTimeout(60 * 1000 * 5);
}

EventEmitter.defaultMaxListeners = Infinity;

global.Array = Array;
global.Date = Date;
global.Function = Function;
global.Math = Math;
global.Number = Number;
global.Object = Object;
global.RegExp = RegExp;
global.String = String;
global.Uint8Array = Uint8Array;
global.WeakMap = WeakMap;
global.Set = Set;
global.Error = Error;
global.TypeError = TypeError;
global.parseInt = parseInt;
global.parseFloat = parseFloat;

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  jest.restoreAllMocks();
});
