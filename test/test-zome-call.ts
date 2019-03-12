import * as test from 'tape'
import * as sinon from 'sinon'

import * as Common from './common'
import {mockResponse, sinonTest} from './common'
import {serviceLoggerInstanceIdFromHappId} from '../src/config'
import {IntrceptrServer} from '../src/server'
import * as Z from '../src/flows/zome-call'

const S = sinon.assert

const setup = () => {
  const masterClient = Common.testMasterClient()
  const publicClient = Common.testPublicClient()
  const internalClient = Common.testInternalClient()
  const intrceptr = new IntrceptrServer({masterClient, publicClient, internalClient})
  intrceptr.server = Common.testRpcServer()
  return {intrceptr, masterClient, publicClient, internalClient}
}

test('can calculate metrics', t => {
  const request = {giveMe: 'what i want'}
  const response = {here: 'you go'}
  const metrics = Z.calcMetrics(request, response)
  t.deepEqual(metrics, {
    bytesIn: 24,
    bytesOut: 17,
  })
  t.end()
})

sinonTest('can call public zome function', async T => {
  const {intrceptr, masterClient, publicClient, internalClient} = setup()

  internalClient.call.withArgs('call').onFirstCall().returns('requestHash')
  internalClient.call.withArgs('call').onSecondCall().returns('responseHash')
  
  const serviceLoggerInstanceId = serviceLoggerInstanceIdFromHappId('happId')
  const request = {params: 'params'}
  const call = {
    agentId: 'agentId',
    happId: 'happId',
    dnaHash: 'dnaHash',
    zome: 'zome',
    function: 'function',
    params: request,
    signature: 'signature',
  }
  const response = await intrceptr.zomeCall(call)
  const requestPackage = Z.buildServiceLoggerRequestPackage(call)
  const responsePackage = Z.buildServiceLoggerResponsePackage(response)
  const metrics = Z.calcMetrics(requestPackage, responsePackage)

  T.equal(response, mockResponse)

  T.callCount(internalClient.call, 2)

  T.calledWith(internalClient.call, 'call', {
    instance_id: serviceLoggerInstanceId,
    zome: 'service',
    function: 'log_request', 
    params: {
      agent_id: 'agentId',
      zome_call_spec: 'TODO',
      dna_hash: 'dnaHash',
      client_signature: 'TODO',
    }
  })

  T.calledWith(internalClient.call, 'call', {
    instance_id: serviceLoggerInstanceId,
    zome: 'service',
    function: 'log_response', 
    params: {
      request_hash: 'requestHash',
      hosting_stats: metrics,
      response_log: mockResponse,
      host_signature: 'TODO, probably should be signed by servicelogger, not externally',
    }
  })

})