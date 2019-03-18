# INTR)-(CEPTR

[![CircleCI](https://circleci.com/gh/Holo-Host/intrceptr.svg?style=svg)](https://circleci.com/gh/Holo-Host/intrceptr)

intrceptr is a nodejs program which provides publicly-exposed ports for browser users to connect to Holo Hosts. It also provides much of the "connective tissue" between various Holo core components: the Holo Hosting App, Signed Service Logs, DeepKey, and the Holochain Conductor itself.

Its primary function is as a websocket server which allows browser users to connect to a Holo Host's machine (HoloPort or otherwise). intrceptr connects directly to a Holochain Conductor running on the same machine, serving as the intermediary between the Holo-hosted user in the browser and the Holo-agnostic DNA instances running in the Holochain Conductor.

It also provides an interface to the Holo Host, allowing them to manage installed hApps and view metrics on service activity.

## Getting Started

Currently under development, so there is no production mode yet, only development mode. The rest of Holo is also in development, and since intrceptr connects several pieces of Holo together, there are several temporary "shims" in place. As those pieces are built, the shims will go away.

## Installation

One shim is a sample DNA to work with, included as a git submodule, so to start with:

	git submodule init && git submodule update

Now, install NPM dependencies:

	yarn install

To get the necessary DNAs and UIs ready, including shims, run this script:

	yarn run build-happs

To enable the intrceptr to generate the initial Conductor configuration including host keys, you need to create some keys and let intrceptr know about them:

	hc keygen

Now, make a special file that intrceptr can read to determine your key info. It's a JSON file with two fields, "publicAddress" and "keyFile". Example:

	cat shims/intrceptr-host-key.json
	{
	    "publicAddress": "HcSciov95SKY7uxomk9DwbFgZhK93rfjbFe6Xgwffz8j3cxbFc4JkPKKSmx7odr",
	    "keyFile": "/home/me/.config/holochain/keys/HcSciov95SKY7uxomk9DwbFgZhK93rfjbFe6Xgwffz8j3cxbFc4JkPKKSmx7odr"
	}

Finally, to create the initial Conductor configuration needed by intrceptr, run this handy script:

	yarn run init

These steps only need to be run once. However, you may run `init` as often as you like to start with a fresh Conductor state.

## Usage

To start a conductor using the config generated by `init`, you may run:

	yarn run conductor

In the future, the intrceptr may spawn a conductor on its own, but for development it's helpful to run this as a separate process to get the full log output.

Finally, to run the intrceptr itself, you can run:

	yarn run start

Upon which it will immediately connect to the Conductor at the admin websocket interface specified in the Conductor config, and run its own servers for incoming connections and requests.

## More info

If at any time you want to update the submodules to the latest commit run the command
```
git submodule update --remote --merge
```

See https://hackmd.io/5xL7XKp5Srm_Ez5_eTxAOQ for latest design considerations. See also https://hackmd.io/cvXMlcffThSpN-C5WrfGzg for an earlier design doc with the broader picture but possibly outdated details.
