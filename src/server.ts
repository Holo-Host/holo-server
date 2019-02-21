/**
 * Server for Holo
 * 
 * Accepts requests similar to what the Conductor
 */

import {Client, Server} from 'rpc-websockets'

import * as Q from './queries'


export default (port) => {

  // a Client to the interface served by the Conductor
  const client = new Client('ws://localhost:8888')
  client.on('open', () => {

    // a Server for hQuery running in the browser
    const server = new Server({
      port,
      host: 'localhost'
    })

    server.register('holo/call', Q.holoCall)

    server.register('holo/apps/install', async ({happId}) => {
      await Q.lookupHoloApp({happId})
    })
    
  })
}

const mapRequest = async (req) => {
  const {dnaHash, agentKey} = req
}
