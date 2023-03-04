import React, { ReactElement, useEffect, useState } from 'react'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '@context/UserPreferences'
import Button from '@shared/atoms/Button'
import AddToken from '@shared/AddToken'
import Conversion from '@shared/Price/Conversion'
import { useWeb3 } from '@context/Web3'
import { getOceanConfig } from '@utils/ocean'
import styles from './Details.module.css'
import { useWeb3Auth } from '@context/Web3Auth'
import Link from 'next/link'

export default function Details(): ReactElement {
  const { web3Auth, connect, logout, networkData, networkId, balance } =
    useWeb3Auth()
  const { locale } = useUserPreferences()

  const [mainCurrency, setMainCurrency] = useState<string>()
  const [oceanTokenMetadata, setOceanTokenMetadata] = useState<{
    address: string
    symbol: string
  }>()

  useEffect(() => {
    if (!networkId) return

    const symbol = networkData?.nativeCurrency.symbol
    setMainCurrency(symbol)

    const oceanConfig = getOceanConfig(networkId)
    console.log('balance', balance)
    oceanConfig &&
      setOceanTokenMetadata({
        address: oceanConfig.oceanTokenAddress,
        symbol: oceanConfig.oceanTokenSymbol
      })
  }, [networkData, networkId])

  return (
    <div className={styles.details}>
      <ul>
        {Object.entries(balance).map(([key, value]) => (
          <li className={styles.balance} key={key}>
            <a
              href={
                key === 'eth'
                  ? 'https://mumbaifaucet.com/'
                  : 'https://faucet.mumbai.oceanprotocol.com/'
              }
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.symbol}>
                {key === 'eth' ? mainCurrency : key.toUpperCase()}
              </span>
            </a>
            <span className={styles.value}>
              {formatCurrency(Number(value), '', locale, false, {
                significantFigures: 4
              })}
            </span>
            <Conversion
              className={styles.conversion}
              price={Number(value)}
              symbol={key}
            />
          </li>
        ))}
        <li className={styles.actions}>
          <div title="Connected provider" className={styles.walletInfo}>
            <span className={styles.walletLogoWrap}>
              <img
                className={styles.walletLogo}
                src="https://images.web3auth.io/web3auth-logo.svg"
                alt="Wallet Provider Logo"
              />
              Web3Auth
            </span>
            {undefined === 'MetaMask' && (
              <AddToken
                address={oceanTokenMetadata?.address}
                symbol={oceanTokenMetadata?.symbol}
                className={styles.addToken}
              />
            )}
          </div>
          <p>
            {/* <Button
              style="text"
              size="small"
              onClick={async () => {
                await web3Modal?.clearCachedProvider()
                connect()
              }}
            >
              Switch Wallet
            </Button> */}
            <Button
              style="text"
              size="small"
              onClick={() => {
                logout()
                location.reload()
              }}
            >
              Disconnect
            </Button>
          </p>
        </li>
      </ul>
    </div>
  )
}
