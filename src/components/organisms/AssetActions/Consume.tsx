import React, { ReactElement, useEffect } from 'react'
import { toast } from 'react-toastify'
import { File as FileMetadata, DDO } from '@oceanprotocol/lib'
import Button from '../../atoms/Button'
import File from '../../atoms/File'
import Price from '../../atoms/Price'
import Web3Feedback from '../../molecules/Wallet/Feedback'
import styles from './Consume.module.css'
import Loader from '../../atoms/Loader'
import { useOcean, useConsume } from '@oceanprotocol/react'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'

export default function Consume({
  ddo,
  file,
  isBalanceSufficient,
  dtBalance
}: {
  ddo: DDO
  file: FileMetadata
  isBalanceSufficient: boolean
  dtBalance: string
}): ReactElement {
  const { ocean } = useOcean()
  const { marketFeeAddress } = useSiteMetadata()
  const { consumeStepText, consume, consumeError } = useConsume()

  const isDisabled = !ocean || !isBalanceSufficient

  async function handleConsume() {
    await consume(ddo.id, ddo.dataToken, 'access', marketFeeAddress)
  }

  useEffect(() => {
    consumeError && toast.error(consumeError)
  }, [consumeError])

  const PurchaseButton = () => (
    <div>
      {consumeStepText ? (
        <Loader message={consumeStepText} />
      ) : (
        <Button style="primary" onClick={handleConsume} disabled={isDisabled}>
          Buy
        </Button>
      )}
    </div>
  )

  return (
    <aside className={styles.consume}>
      <div className={styles.info}>
        <div className={styles.filewrapper}>
          <File file={file} />
        </div>
        <div className={styles.pricewrapper}>
          <Price ddo={ddo} conversion />
          <PurchaseButton />
        </div>
      </div>

      <footer className={styles.feedback}>
        <Web3Feedback isBalanceSufficient={isBalanceSufficient} />
      </footer>
    </aside>
  )
}
