# mgl-validate ChangeLog

## 2016-10-03, [v2.1.0](https://github.com/magora-labs/mgl-validate/tree/v2.1.0) **_<small>stable</small>_**

### Commits

  - [[`85f9f4a974`](https://github.com/magora-labs/mgl-validate/commit/85f9f4a9743dbe662e477f39c29302deae991889)] - **deps**: eslint v3.6.1, nyc v8.3.0, mocha v3.1.0
  - [[`9f2e0466a2`](https://github.com/magora-labs/mgl-validate/commit/9f2e0466a2a046c996d18f494e598d40cb1b8372)] - **package**: update scripts
  - [[`a3e31b7338`](https://github.com/magora-labs/mgl-validate/commit/a3e31b733896e18f812aadb313c4f38316f43b28)] - **schema**: add `allowNullValue` property


## 2016-07-12, [v2.0.1](https://github.com/magora-labs/mgl-validate/tree/v2.0.1) **_<small>stable</small>_**

### Commits

  - [[`bac74ddb7e`](https://github.com/magora-labs/mgl-validate/commit/bac74ddb7e8de314ba66061885fe7e8b583fcb2c)] - **deps**: mocha 2.5.3
  - [[`afddc25b31`](https://github.com/magora-labs/mgl-validate/commit/afddc25b318db66379d662cb090c0cd12514c5ba)] - **deps**: istanbul 0.4.3
  - [[`97f335920d`](https://github.com/magora-labs/mgl-validate/commit/97f335920d7aebc2004ce1d94383091e5607c4aa)] - **deps**: eslint 2.11.1
  - [[`611a93f91c`](https://github.com/magora-labs/mgl-validate/commit/611a93f91c7cc8fbf82acd346888e9093da6a3a4)] - **doc**: add Christian Steininger to AUTHORS
  - [[`fcd7bcaa82`](https://github.com/magora-labs/mgl-validate/commit/fcd7bcaa828a37c872dce1c417118d1defd11918)] - **schema**: fix breakOnError option for array & mixed types


## 2016-04-04, [v2.0.0](https://github.com/magora-labs/mgl-validate/tree/v2.0.0) **_<small>stable</small>_**

### Notable Changes

  * Validation errors are returned without an error object, **all other errors are immediately thrown!**
  * The **enum** option has been refactored and introduces a new **ordered** option flag for more versatile **array** validation
    * Validation errors for the `enum` option now state `'value'` instead of `'enum'` as reason
    * Primitives only allow primitives of the the same type as elements of an array
  * Support for **recursive & self-registering schemas** has been added

## 2015-08-14, [v1.0.2](https://github.com/magora-labs/mgl-validate/tree/v1.0.2) **_<small>stable</small>_**

### Commits

  - [[`34f873351e`](https://github.com/magora-labs/mgl-validate/commit/34f873351ee326692ad0ba492fe32b3ddc570250)] - **config**: travis uses iojs v2.5.0
  - [[`a9a0032f0b`](https://github.com/magora-labs/mgl-validate/commit/a9a0032f0bcfa4367313ba166eb55a9d2632a914)] - **deps**: update dev dependencies
  - [[`a4322c9c18`](https://github.com/magora-labs/mgl-validate/commit/a4322c9c18b00d2ef5cf54d9557fcc6d3347a873)] - **schema**: extend definition type validation


## 2015-04-16, [v1.0.1](https://github.com/magora-labs/mgl-validate/tree/v1.0.1) **_<small>stable</small>_**

### Commits

  - [[`36bf33a8cc`](https://github.com/magora-labs/mgl-validate/commit/36bf33a8cc101a31b797656223df8adaef3c9a10)] - **deps**: changelog42: v0.5.0
  - [[`acefe7a051`](https://github.com/magora-labs/mgl-validate/commit/acefe7a051e862c48cc1284152f1574a6dd43030)] - **deps**: eslint v0.20.0
  - [[`0abef4526c`](https://github.com/magora-labs/mgl-validate/commit/0abef4526cc0581215fea1af029db9e88ea21757)] - **doc**: add introductory text
  - [[`37530b2b44`](https://github.com/magora-labs/mgl-validate/commit/37530b2b4430b63225644d5b0944028f0f750bca)] - **doc/README**: add dependency badge
  - [[`6e6358bee9`](https://github.com/magora-labs/mgl-validate/commit/6e6358bee9c332c4f0fb5f32d9f642811046dd72)] - **eslint**: update config (operator linebreak)
  - [[`1ec1e34c74`](https://github.com/magora-labs/mgl-validate/commit/1ec1e34c7453d801b3d4ace52d123ca8d82e0349)] - **package**: add changelog script
  - [[`8fbba192ac`](https://github.com/magora-labs/mgl-validate/commit/8fbba192ace3a3c6a01694f8cda92458eb8c3efe)] - **package**: update script calls to be less verbose
  - [[`ec02a2e63d`](https://github.com/magora-labs/mgl-validate/commit/ec02a2e63d9b18332a909437126a21d3494e826f)] - **package**: npm engine version v2.8.3
  - [[`3e1dc16a0b`](https://github.com/magora-labs/mgl-validate/commit/3e1dc16a0b2f80f4c95096f63d5f2d2c2fdfc35c)] - **package**: add keywords for search
  - [[`1e77beb766`](https://github.com/magora-labs/mgl-validate/commit/1e77beb76687d35d0c8c6b80936d222898fa8607)] - **package**: add license: "MIT"


## 2015-04-16, [v1.0.0](https://github.com/magora-labs/mgl-validate/tree/v1.0.0) **_<small>stable</small>_**

**first public release**
