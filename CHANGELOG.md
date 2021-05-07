## [0.36.4](https://github.com/vuex-orm/vuex-orm/compare/v0.36.3...v0.36.4) (2021-05-07)

### Bug Fixes

* **database:** improve performance with entity lookup ([#718](https://github.com/vuex-orm/vuex-orm/issues/718)) ([8b5f104](https://github.com/vuex-orm/vuex-orm/commit/8b5f10443d86d95980715d613a152413e6ad3867))
* `withAll` should observe constraints ([f3fdf02](https://github.com/vuex-orm/vuex-orm/commit/f3fdf02cb2a41791073dd8835b408b68ccab03d7))

## [0.36.3](https://github.com/vuex-orm/vuex-orm/compare/v0.36.2...v0.36.3) (2020-03-12)


## Bug Fixes

- #455 `$update` function not working with a composite primary key.
- #596 Fix persist methods failing to create an array of records in the Nuxt server-side environment.


## Improvements

- #590 Add support for composite primary keys in `whereId` and `whereIdIn` clause.


## [0.36.2](https://github.com/vuex-orm/vuex-orm/compare/v0.36.1...v0.36.2) (2020-03-08)


### Bug Fixes

* `findIn` should respect relations just as `find` does. ([57b8ed0](https://github.com/vuex-orm/vuex-orm/commit/57b8ed04d4251d491e635fbcee5ed92e4e38fb71))
* **Query:** `findIn` should resolve relations like it's counterpart `find`. ([11b0994](https://github.com/vuex-orm/vuex-orm/commit/11b099413c774bc098648b673a816caec8b4b155))
* `findIn` should respect relations just as `find` does. ([0642bb5](https://github.com/vuex-orm/vuex-orm/commit/0642bb5e9b584f89f318df0c7370f0d2835bd659))
* hasManyBy orderBy constraint ([4306839](https://github.com/vuex-orm/vuex-orm/commit/43068398ad205f2d62ab76294f65fa8381338b1a))
* lint ([44f23b9](https://github.com/vuex-orm/vuex-orm/commit/44f23b98383c58cf35e0f65f48101421c7ae7386))
* **deps:** breaking changes in Normalizr 3.5 ([3c64272](https://github.com/vuex-orm/vuex-orm/commit/3c642728b829006a93ac1d1f9b33144d109ad606)), closes [#553](https://github.com/vuex-orm/vuex-orm/issues/553) [#516](https://github.com/vuex-orm/vuex-orm/issues/516) [#564](https://github.com/vuex-orm/vuex-orm/issues/564)



## [0.36.1](https://github.com/vuex-orm/vuex-orm/compare/v0.36.0...v0.36.1) (2020-03-04)



# [0.36.0](https://github.com/vuex-orm/vuex-orm/compare/v0.35.2...v0.36.0) (2020-03-03)


### Bug Fixes

* **docs:** broken link ([fec4bbd](https://github.com/vuex-orm/vuex-orm/commit/fec4bbd5043c957e7c94a37042e6235e96274526)), closes [#569](https://github.com/vuex-orm/vuex-orm/issues/569)
* delete package-lock.json ([73358ea](https://github.com/vuex-orm/vuex-orm/commit/73358eaa0bf9e319b03f81b7340612bb9b319ac0))


### Features

* **plugin:** expose database to plugin method ([#557](https://github.com/vuex-orm/vuex-orm/issues/557)) ([cb54710](https://github.com/vuex-orm/vuex-orm/commit/cb5471002e87546f4c138256d08da3f98b2ef0f1))
* insert data into pivot models for belongs to many relationships ([b2d2729](https://github.com/vuex-orm/vuex-orm/commit/b2d272949e5bdcc6ae5c5c552a0b74fdfab1fe66))
* insert pivot data into many to many relations default key pivot ([d79f42f](https://github.com/vuex-orm/vuex-orm/commit/d79f42f187494d3710b4b483e3e808bbdee9b8b3))
* retrieve many to many relations with pivot data ([bf13add](https://github.com/vuex-orm/vuex-orm/commit/bf13adde27f66198de36fa0d3bb93ece05706f89))



## [0.35.2](https://github.com/vuex-orm/vuex-orm/compare/v0.35.1...v0.35.2) (2020-02-01)



## [0.35.1](https://github.com/vuex-orm/vuex-orm/compare/v0.35.0...v0.35.1) (2020-01-28)



# [0.35.0](https://github.com/vuex-orm/vuex-orm/compare/v0.34.1...v0.35.0) (2020-01-27)


### Bug Fixes

* Has Many By wrong words ([4f5db04](https://github.com/vuex-orm/vuex-orm/commit/4f5db0454a635cde08e6dccf2858377f1b16664e))
* pivot table composite key can be in any order ([6b0fe34](https://github.com/vuex-orm/vuex-orm/commit/6b0fe344a0ed30933457a2c0f3250ba90593a660))
* remove index id from toJson method result ([772d4a1](https://github.com/vuex-orm/vuex-orm/commit/772d4a1cdf488e8fa8f06a610232e750703236be))


### Features

* add context based model access feature ([5a56866](https://github.com/vuex-orm/vuex-orm/commit/5a568660be04b60489448f0276cf25da1d1c6102))


### Reverts

* Revert "refactor: move schemas interface declaration to database" ([bcfc984](https://github.com/vuex-orm/vuex-orm/commit/bcfc9843569ecd608457fbe7158719c430032f81))



## [0.34.1](https://github.com/vuex-orm/vuex-orm/compare/v0.34.0...v0.34.1) (2019-11-26)



# [0.34.0](https://github.com/vuex-orm/vuex-orm/compare/v0.33.0...v0.34.0) (2019-11-25)


### Reverts

* Revert "Vuex orm build" ([e322b23](https://github.com/vuex-orm/vuex-orm/commit/e322b2391fe8fe8b050db714e22aea952a7c6abe))



# [0.33.0](https://github.com/vuex-orm/vuex-orm/compare/v0.32.5...v0.33.0) (2019-10-30)



## [0.32.5](https://github.com/vuex-orm/vuex-orm/compare/v0.32.4...v0.32.5) (2019-10-21)



## [0.32.4](https://github.com/vuex-orm/vuex-orm/compare/v0.32.3...v0.32.4) (2019-10-08)


### Bug Fixes

* abstract make () ([02bfb46](https://github.com/vuex-orm/vuex-orm/commit/02bfb46b6883398edf03721b8519522ef1bee100))



## [0.32.3](https://github.com/vuex-orm/vuex-orm/compare/v0.32.2...v0.32.3) (2019-10-02)



## [0.32.2](https://github.com/vuex-orm/vuex-orm/compare/v0.32.1...v0.32.2) (2019-09-02)



## [0.32.1](https://github.com/vuex-orm/vuex-orm/compare/v0.32.0...v0.32.1) (2019-07-23)



# [0.32.0](https://github.com/vuex-orm/vuex-orm/compare/v0.31.13...v0.32.0) (2019-07-10)



## [0.31.13](https://github.com/vuex-orm/vuex-orm/compare/v0.31.12...v0.31.13) (2019-07-08)


### Bug Fixes

* i made null not included in addEagerConstraintForRelated.query.whereFk.getKeys ([9538461](https://github.com/vuex-orm/vuex-orm/commit/9538461170431afdd9255ce582dd2e3a46a4b5cc))



## [0.31.12](https://github.com/vuex-orm/vuex-orm/compare/v0.31.11...v0.31.12) (2019-05-23)



## [0.31.11](https://github.com/vuex-orm/vuex-orm/compare/v0.31.10...v0.31.11) (2019-05-14)



## [0.31.10](https://github.com/vuex-orm/vuex-orm/compare/v0.31.9...v0.31.10) (2019-04-23)


### Bug Fixes

* create nested data with composite key ([ec02683](https://github.com/vuex-orm/vuex-orm/commit/ec02683e41cf65b3b0e4b4089a0be3442a97017e))



## [0.31.9](https://github.com/vuex-orm/vuex-orm/compare/v0.31.8...v0.31.9) (2019-04-16)



## [0.31.8](https://github.com/vuex-orm/vuex-orm/compare/v0.31.7...v0.31.8) (2019-04-08)


### Bug Fixes

* Object.assign is not defined in IE11 ([6f0b430](https://github.com/vuex-orm/vuex-orm/commit/6f0b430729d97aae5f242342cd85b03d488b5c3b))



## [0.31.7](https://github.com/vuex-orm/vuex-orm/compare/v0.31.6...v0.31.7) (2019-03-26)


### Bug Fixes

* lost pivot record with field data ([76815a5](https://github.com/vuex-orm/vuex-orm/commit/76815a5bb1777673038a9731d39864bed8a6bcb1))



## [0.31.6](https://github.com/vuex-orm/vuex-orm/compare/v0.31.5...v0.31.6) (2019-02-25)


### Bug Fixes

* morphMany is return [] if nothing references record ([6610e60](https://github.com/vuex-orm/vuex-orm/commit/6610e602224a18cc9c2e26272bd56f00907ada02))
* resolve reference by localKey ([baf97d9](https://github.com/vuex-orm/vuex-orm/commit/baf97d97550764a142a89753ab91062ccbc74820))



## [0.31.5](https://github.com/vuex-orm/vuex-orm/compare/v0.31.4...v0.31.5) (2019-02-19)


### Bug Fixes

* belongsToMany is return [] if nothing references records ([e30347d](https://github.com/vuex-orm/vuex-orm/commit/e30347dd454202d9701c23a047ac12dd44905738))
* retrieving relation by empty key ([4a75fa0](https://github.com/vuex-orm/vuex-orm/commit/4a75fa056636f8296f8f0ec9c777a025a6ea7fe4))


### Features

* add beforeRelations & afterRelations hooks ([fb1625e](https://github.com/vuex-orm/vuex-orm/commit/fb1625e44c0685da3383c32cea10c51f6e3def24))



## [0.31.4](https://github.com/vuex-orm/vuex-orm/compare/v0.31.3...v0.31.4) (2019-02-12)


### Bug Fixes

* duplicate insert pivot record if call insertOrUpdate twice ([40246e4](https://github.com/vuex-orm/vuex-orm/commit/40246e41df459fd3cbb7835f2d2b4d7759ff9569))



## [0.31.3](https://github.com/vuex-orm/vuex-orm/compare/v0.31.2...v0.31.3) (2019-02-03)



## [0.31.2](https://github.com/vuex-orm/vuex-orm/compare/v0.31.1...v0.31.2) (2018-12-25)



## [0.31.1](https://github.com/vuex-orm/vuex-orm/compare/v0.31.0...v0.31.1) (2018-12-04)



# [0.31.0](https://github.com/vuex-orm/vuex-orm/compare/v0.30.0...v0.31.0) (2018-12-03)



# [0.30.0](https://github.com/vuex-orm/vuex-orm/compare/v0.29.0...v0.30.0) (2018-11-08)


### Bug Fixes

* change judgment logic of related property ([de01042](https://github.com/vuex-orm/vuex-orm/commit/de01042141df06398f3d104fc644a868fdec5b08))
* Change the object to be returned to the updated object ([7a3bf25](https://github.com/vuex-orm/vuex-orm/commit/7a3bf25d810baa127cdac7b1f8172e9dd7d84a2f))
* not save relation ([6c41de4](https://github.com/vuex-orm/vuex-orm/commit/6c41de4a910235b7e68bc27a23431100dab0afac))
* return fill insertOrUpdate data ([a98d876](https://github.com/vuex-orm/vuex-orm/commit/a98d87613e5436507840f242e01209fd2d03fd1a))


### Features

* save method to model class ([6c8e68d](https://github.com/vuex-orm/vuex-orm/commit/6c8e68dbc4f1878bffc24bccb711b8a54ffd745f))



# [0.29.0](https://github.com/vuex-orm/vuex-orm/compare/v0.28.0...v0.29.0) (2018-10-30)


### Reverts

* Revert "yarn lock" ([c256239](https://github.com/vuex-orm/vuex-orm/commit/c2562397812aa2e35ebeaac5c5606c2964532c16))



# [0.28.0](https://github.com/vuex-orm/vuex-orm/compare/v0.27.0...v0.28.0) (2018-10-26)



# [0.27.0](https://github.com/vuex-orm/vuex-orm/compare/v0.26.3...v0.27.0) (2018-10-11)



## [0.26.3](https://github.com/vuex-orm/vuex-orm/compare/v0.26.2...v0.26.3) (2018-10-04)



## [0.26.2](https://github.com/vuex-orm/vuex-orm/compare/v0.26.1...v0.26.2) (2018-09-25)


### Bug Fixes

* change path solution to multiple environments ([ce7b87a](https://github.com/vuex-orm/vuex-orm/commit/ce7b87a61773f39ebc146e76755a148dd54ea3ff))


### Features

* install cross-env to support multiple environments ([7c72c2b](https://github.com/vuex-orm/vuex-orm/commit/7c72c2bb905d7b89d414f445c70d0eb7662b3df8))



## [0.26.1](https://github.com/vuex-orm/vuex-orm/compare/0.26.0...v0.26.1) (2018-08-22)



# [0.26.0](https://github.com/vuex-orm/vuex-orm/compare/v0.25.7...0.26.0) (2018-08-20)



## [0.25.7](https://github.com/vuex-orm/vuex-orm/compare/v0.25.6...v0.25.7) (2018-08-14)


### Bug Fixes

* pivot table set primary key id if ignore createPivotRecord ([184d279](https://github.com/vuex-orm/vuex-orm/commit/184d279e36bc976eaecb63d475b020bb897a353f))



## [0.25.6](https://github.com/vuex-orm/vuex-orm/compare/v0.25.5...v0.25.6) (2018-07-18)



## [0.25.5](https://github.com/vuex-orm/vuex-orm/compare/v0.25.4...v0.25.5) (2018-07-11)



## [0.25.4](https://github.com/vuex-orm/vuex-orm/compare/v0.25.3...v0.25.4) (2018-06-30)



## [0.25.3](https://github.com/vuex-orm/vuex-orm/compare/v0.25.2...v0.25.3) (2018-06-26)



## [0.25.2](https://github.com/vuex-orm/vuex-orm/compare/v0.25.1...v0.25.2) (2018-06-21)



## [0.25.1](https://github.com/vuex-orm/vuex-orm/compare/v0.25.0...v0.25.1) (2018-05-21)



# [0.25.0](https://github.com/vuex-orm/vuex-orm/compare/v0.24.5...v0.25.0) (2018-04-30)



## [0.24.5](https://github.com/vuex-orm/vuex-orm/compare/v0.24.4...v0.24.5) (2018-04-24)



## [0.24.4](https://github.com/vuex-orm/vuex-orm/compare/v0.24.3...v0.24.4) (2018-04-16)



## [0.24.3](https://github.com/vuex-orm/vuex-orm/compare/v0.24.2...v0.24.3) (2018-04-11)



## [0.24.2](https://github.com/vuex-orm/vuex-orm/compare/v0.24.1...v0.24.2) (2018-04-05)



## [0.24.1](https://github.com/vuex-orm/vuex-orm/compare/v0.24.0...v0.24.1) (2018-04-03)



# [0.24.0](https://github.com/vuex-orm/vuex-orm/compare/v0.23.4...v0.24.0) (2018-04-03)


### Bug Fixes

* HasManyThrough Relation only last record ([cdf3765](https://github.com/vuex-orm/vuex-orm/commit/cdf3765bb41dafa1c9ce0c0b8f8b5caa41d32dba))



## [0.23.4](https://github.com/vuex-orm/vuex-orm/compare/v0.23.3...v0.23.4) (2018-03-25)



## [0.23.3](https://github.com/vuex-orm/vuex-orm/compare/v0.23.2...v0.23.3) (2018-03-21)



## [0.23.2](https://github.com/vuex-orm/vuex-orm/compare/v0.23.1...v0.23.2) (2018-03-17)



## [0.23.1](https://github.com/vuex-orm/vuex-orm/compare/v0.23.0...v0.23.1) (2018-03-16)



# [0.23.0](https://github.com/vuex-orm/vuex-orm/compare/v0.22.0...v0.23.0) (2018-03-13)


### Bug Fixes

* Return empty model object none related ([02fb245](https://github.com/vuex-orm/vuex-orm/commit/02fb24588580492bc9e2c3c533084cd6fd517a6e))



# [0.22.0](https://github.com/vuex-orm/vuex-orm/compare/v0.21.1...v0.22.0) (2018-03-04)



## [0.21.1](https://github.com/vuex-orm/vuex-orm/compare/v0.21.0...v0.21.1) (2018-03-01)



# [0.21.0](https://github.com/vuex-orm/vuex-orm/compare/v0.20.2...v0.21.0) (2018-02-28)



## [0.20.2](https://github.com/vuex-orm/vuex-orm/compare/v0.20.1...v0.20.2) (2018-02-24)



## [0.20.1](https://github.com/vuex-orm/vuex-orm/compare/v0.20.0...v0.20.1) (2018-02-23)



# [0.20.0](https://github.com/vuex-orm/vuex-orm/compare/v0.19.0...v0.20.0) (2018-02-19)



# [0.19.0](https://github.com/vuex-orm/vuex-orm/compare/v0.18.0...v0.19.0) (2018-02-14)



# [0.18.0](https://github.com/vuex-orm/vuex-orm/compare/v0.17.0...v0.18.0) (2018-02-09)



# [0.17.0](https://github.com/vuex-orm/vuex-orm/compare/v0.16.3...v0.17.0) (2018-02-04)



## [0.16.3](https://github.com/vuex-orm/vuex-orm/compare/v0.16.2...v0.16.3) (2018-01-31)



## [0.16.2](https://github.com/vuex-orm/vuex-orm/compare/v0.16.1...v0.16.2) (2018-01-26)



## [0.16.1](https://github.com/vuex-orm/vuex-orm/compare/v0.16.0...v0.16.1) (2018-01-23)



# [0.16.0](https://github.com/vuex-orm/vuex-orm/compare/v0.15.0...v0.16.0) (2018-01-23)



# [0.15.0](https://github.com/vuex-orm/vuex-orm/compare/v0.14.2...v0.15.0) (2018-01-14)



## [0.14.2](https://github.com/vuex-orm/vuex-orm/compare/v0.14.1...v0.14.2) (2018-01-04)



## [0.14.1](https://github.com/vuex-orm/vuex-orm/compare/v0.14.0...v0.14.1) (2018-01-03)



# [0.14.0](https://github.com/vuex-orm/vuex-orm/compare/v0.13.4...v0.14.0) (2018-01-03)



## [0.13.4](https://github.com/vuex-orm/vuex-orm/compare/v0.13.3...v0.13.4) (2017-12-26)



## [0.13.3](https://github.com/vuex-orm/vuex-orm/compare/v0.13.2...v0.13.3) (2017-12-20)



## [0.13.2](https://github.com/vuex-orm/vuex-orm/compare/v0.13.1...v0.13.2) (2017-12-19)



## [0.13.1](https://github.com/vuex-orm/vuex-orm/compare/v0.13.0...v0.13.1) (2017-12-07)



# [0.13.0](https://github.com/vuex-orm/vuex-orm/compare/v0.12.0...v0.13.0) (2017-12-01)



# [0.12.0](https://github.com/vuex-orm/vuex-orm/compare/v0.11.5...v0.12.0) (2017-12-01)



## [0.11.5](https://github.com/vuex-orm/vuex-orm/compare/v0.11.4...v0.11.5) (2017-11-23)



## [0.11.4](https://github.com/vuex-orm/vuex-orm/compare/v0.11.3...v0.11.4) (2017-11-18)



## [0.11.3](https://github.com/vuex-orm/vuex-orm/compare/v0.11.2...v0.11.3) (2017-11-17)



## [0.11.2](https://github.com/vuex-orm/vuex-orm/compare/v0.11.1...v0.11.2) (2017-11-08)



## [0.11.1](https://github.com/vuex-orm/vuex-orm/compare/v0.11.0...v0.11.1) (2017-11-06)



# [0.11.0](https://github.com/vuex-orm/vuex-orm/compare/v0.10.0...v0.11.0) (2017-10-29)



## [0.8.1](https://github.com/vuex-orm/vuex-orm/compare/v0.8.0...v0.8.1) (2017-10-21)



# [0.8.0](https://github.com/vuex-orm/vuex-orm/compare/v0.7.2...v0.8.0) (2017-10-21)



## [0.7.2](https://github.com/vuex-orm/vuex-orm/compare/v0.7.1...v0.7.2) (2017-10-21)



## [0.7.1](https://github.com/vuex-orm/vuex-orm/compare/v0.7.0...v0.7.1) (2017-10-18)



# [0.7.0](https://github.com/vuex-orm/vuex-orm/compare/v0.6.0...v0.7.0) (2017-10-17)



# [0.6.0](https://github.com/vuex-orm/vuex-orm/compare/v0.5.0...v0.6.0) (2017-10-17)



# [0.5.0](https://github.com/vuex-orm/vuex-orm/compare/v0.4.0...v0.5.0) (2017-10-17)



# [0.4.0](https://github.com/vuex-orm/vuex-orm/compare/v0.3.1...v0.4.0) (2017-10-16)



## [0.3.1](https://github.com/vuex-orm/vuex-orm/compare/v0.3.0...v0.3.1) (2017-09-29)



# [0.3.0](https://github.com/vuex-orm/vuex-orm/compare/v0.2.2...v0.3.0) (2017-09-26)



## [0.2.2](https://github.com/vuex-orm/vuex-orm/compare/v0.2.1...v0.2.2) (2017-09-20)



## [0.2.1](https://github.com/vuex-orm/vuex-orm/compare/v0.2.0...v0.2.1) (2017-09-02)



# [0.2.0](https://github.com/vuex-orm/vuex-orm/compare/v0.1.1...v0.2.0) (2017-08-26)



## [0.1.1](https://github.com/vuex-orm/vuex-orm/compare/v0.1.0...v0.1.1) (2017-06-16)



# 0.1.0 (2017-06-16)



