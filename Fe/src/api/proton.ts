import constants from '../constants'
import { ApiClass } from '@proton/api'
import { constants as bloksConstants } from '@bloks/constants'

const { CHAIN } = constants
bloksConstants.initialize(CHAIN)

export const proton = new ApiClass()
proton.initialize(bloksConstants)
