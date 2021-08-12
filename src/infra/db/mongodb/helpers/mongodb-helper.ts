/* eslint-disable no-underscore-dangle */
import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },
  async disconnect(): Promise<void> {
    this.client.close()
  },
  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },
  async map<T>(collection: any, collectionName: string): Promise<T> {
    const dataCollection = await MongoHelper.getCollection(collectionName).findOne(collection.insertedId, {})
    const dataModel = { ...dataCollection, id: collection.insertedId.toString() } as unknown as T
    return dataModel
  },
}
