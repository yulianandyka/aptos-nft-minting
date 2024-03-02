import type { NextPage } from 'next'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from '../styles/home.module.scss'
import { createInflate } from 'zlib'
import toast from "../components/Toast"

const Home: NextPage = () => {
  const [isMartian, setMartian] = useState(false)
  const [isConnected, setConnect] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [viewType, setViewType] = useState('simple')
  const [address, setAddress] = useState('')

  const [nftImgUrl, setNftImgUrl] = useState("")
  const [nftID, setnftID] = useState(0)
  const [nftName, setNftName] = useState("")
  const [nftDescription, setNftDescription] = useState("")

  

  useEffect(() => {
    let id = Math.floor(Math.random() * (1999 - 0 + 1)) + 0;
    setnftID(id)
    setNftImgUrl("https://bafybeibrteurbwo76af6c4l4jc3k5dvjd7f73l62peonbsni4qibkk27hq.ipfs.dweb.link/"+id+".png")
  }, [])

  const btnConnect = async () => {
    await window.martian.connect()
    const isConnected = await window.martian.isConnected()
    setConnect(isConnected)
    if(isConnected) {
      const martianAccount = await window.martian.account()
      setAddress(martianAccount.address)
    }
  }

  
  useEffect(()=>{
    if ("martian" in window) {
      setMartian(true)
    }  
  }, [])

  const notify = useCallback((type, message) => {
    toast({ type, message });
  }, []);

  const btnCreatecollection = async () => {
    const transactions = await window.martian.getTransactions()
    console.log(transactions)
    const txnHash = await window.martian.createCollection("AptosNFT", "#"+nftID, nftImgUrl)

    notify("success", "Apetos NFT is successfully added to your wallet")
  }
  const btnCreateNft = async () => {
    const txnHash = await window.martian.createToken("AptosNFT", "#"+nftID, "This is first NFT in Aptos Chain by Andrei", 1, nftImgUrl, 2000)
    //const txnHash = await window.martian.createCollection("AptosNFT", "#"+nftID, nftImgUrl)
    notify("success", "Minted Successfully ! Number : " + nftID)
    setTimeout(() => {
      let id = Math.floor(Math.random() * (1999 - 0 + 1)) + 0;
      setnftID(id)
      console.log("new id ", nftID)
    }, 3000);


  }


  return (
    <div className={`${styles.homeContainer} flex flex-col justify-center items-center h-full w-full`}>
      <div className='flex flex-col justify-center items-center h-full w-full'>
        {
          !isMartian ? (
            <>
              <p style={{fontSize: '25px'}}>It seems like you have not installed<span className={styles.textDarkgreen} style={{fontWeight: 400}}> Martian wallet </span>extension.</p>
              <a href={"https://www.martianwallet.xyz/"} target={"_blank"} className={styles.textDarkgreen} style={{fontWeight: 500, fontSize: '25px'}}>Click here</a>
            </>
          ) : (
            !isConnected ? (
              <button className={`${styles.btn} !px-[30px]`} onClick={btnConnect}>
                {/* onClick={() => setConnect(true)}> */}
                Connect Wallet<span className={styles.textGreen}></span> 
              </button>
            ) : (
              <>
                <div className='flex flex-row justify-between items-start w-full' style={{width: viewType=='simple' ? '40%' : '60%', marginTop: '60px'}}>
                  {
                    viewType != 'simple' &&
                    <div className='flex flex-col justify-center items-center h-full w-full'>
                      <h2 className='mb-[10px] font-semibold text-[20px]'>Create NFT Collection</h2>
                      <input className={`${styles.input} c-step-1`} placeholder="NFT Collection name" type="text"/>
                      <input className={`${styles.input} c-step-2`} placeholder="NFT Collection description" type="text"/>
                      <input className={`${styles.input} c-step-3`} placeholder="NFT Collection Url" type="text"/>
                      <button className={`${styles.filledBtn} py-[10px] px-[25px] bg-[rgb(21, 215, 145)] text-[#000] font-semibold`}>Create NFT Collection</button>
                    </div>
                  }
                  <div className='flex flex-col justify-center items-center  h-full w-full'>
                    <button className={`${styles.filledBtn} py-[30px] px-[25px] bg-[rgb(21, 215, 145)] text-[#000] font-semibold`} onClick={btnCreateNft}>Mint New NFT</button>
                    <button className={`${styles.filledBtn} py-[30px] px-[25px] bg-[rgb(21, 215, 145)] text-[#000] font-semibold`} onClick={btnCreatecollection}>Aprove your Wallet to Add new collection to your wallet</button>
                  </div>

                </div>
              </>
            )
          )
        }
      </div>
      
      <Link href={'/'}>
        <a className={`${styles.absolute_div} left-[70px]`}>
          <img src="/image/martian.png" alt="Logo" width={23} height={23} />
          <p>Aptos Blockchain NFT Minting</p>
        </a>
      </Link>
      <Link href={'/'}>
        <a className={`${styles.absolute_div} right-[70px]`}>
        {address.substring(0, 6) + "..." + address.substring(address.length - 4)}
        </a>
      </Link>
    </div>
  )
}

export default Home
