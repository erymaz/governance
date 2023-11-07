import { useCookies } from 'vue3-cookies';
import { constants as bloksConstants } from '@bloks/constants'
import ProtonSDK, { ProtonWebLink } from '@proton/web-sdk'
import { LinkSession, TransactResult, Link } from '@proton/link';
import { Serialize } from '@proton/js'
import { GOV_CONTRACT } from '@/constants';

export let link: ProtonWebLink | Link | null | undefined
export let session: LinkSession | null | undefined

export const createLink = async ({
  restoreSession = false
}: { restoreSession?: boolean }): Promise<void> => {
  const { link: localLink, session: localSession } = await ProtonSDK({
    linkOptions: {
      endpoints: bloksConstants.DEFAULT_ENDPOINTS,
      chainId: bloksConstants.CHAIN_ID,
      restoreSession
    },
    transportOptions: {
      requestAccount: 'dex',
      requestStatus: false,
    },
    selectorOptions: {
      appName: 'Governance'
    }
  })
  link = localLink
  session = localSession
}

export const login = async (): Promise<LinkSession> => {
  await createLink({ restoreSession: false })
  if (session) {
    return session
  } else {
    throw new Error('No Session')
  }
}

export const transact = async (actions: Serialize.Action[], broadcast: boolean): Promise<TransactResult> => {
  if (session) {
    return session.transact({
      transaction: {
        actions
      } as never
    }, { broadcast })
  } else {
    throw new Error('No Session')
  }
}

export const logout = async (): Promise<void> => {
  const { cookies } = useCookies();
  if (link && session) {
    await link.removeSession(GOV_CONTRACT, session.auth, bloksConstants.CHAIN_ID)
  }
  cookies.remove('authToken');
  session = undefined
  link = undefined
}

export const reconnect = async (): Promise<LinkSession> => {
  if (!session) {
    await createLink({ restoreSession: true })
  }

  if (session) {
    return session
  } else {
    throw new Error('No Session')
  }
}

export default {
  link,
  login,
  transact,
  logout,
  reconnect
}
