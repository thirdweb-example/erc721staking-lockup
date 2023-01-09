import {
    ThirdwebNftMedia,
    useAddress,
    useContract,
    useOwnedNFTs,
    Web3Button,
  } from "@thirdweb-dev/react";
  import { ConnectWallet } from "@thirdweb-dev/react";
  import { NFT } from "@thirdweb-dev/sdk";
  import { BigNumber } from "ethers";
  import type { NextPage } from "next";
  import { useEffect, useState } from "react";
  import { NFT_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS} from "../const/Index";
  import styles from "../styles/Home.module.css";

  const Stake: NextPage = () => {
    const address = useAddress();
    const { contract: nftDropContract } = useContract(
        NFT_CONTRACT_ADDRESS,
        "nft-drop"
    )
    const { contract, isLoading } = useContract(STAKING_CONTRACT_ADDRESS);
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
    const [stakedNfts, setStakedNfts] = useState<NFT[]>([]);
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    
    useEffect(() => {
      if (!contract) return;
    
      async function loadStakedNfts() {
        const stakedTokens = await contract?.call("getStakeInfo", address);
    
        // For each staked token, fetch it from the sdk
        const stakedNfts = await Promise.all(
          stakedTokens[0]?.map(async (stakedToken: BigNumber) => {
            const nft = await nftDropContract?.get(stakedToken.toNumber());
            return nft;
          })
        );
    
        setStakedNfts(stakedNfts);
      }
    
      if (address) {
        loadStakedNfts();
      }
    }, [address, contract, nftDropContract]);
    
    // useEffect(() => {
    //   if (!contract || !address) return;
    
    //   async function loadClaimableRewards() {
    //     const stakeInfo = await contract?.call("getStakeInfo", address);
    //     setClaimableRewards(stakeInfo[1]);
    //   }
    
    //   loadClaimableRewards();
    // }, [address, contract]);
    
    async function stakeNft(id: string) {
      if (!address) return;
      const isApproved = await nftDropContract?.isApproved(
        address,
        STAKING_CONTRACT_ADDRESS
      );
      if (!isApproved) {
        await nftDropContract?.setApprovalForAll(STAKING_CONTRACT_ADDRESS, true);
      }
      await contract?.call("stakeNft", [id]);
    }
    
    // async function withdraw(id: string) {
    //   await contract?.call("withdrawNFT", [id]);
    // }
    
    if (isLoading) {
      return <div>Loading</div>;
    }
    
    return (
      <div className={styles.container}>
        <h1 className={styles.h1}>Lock Your NFTs and earn rewards</h1>
        <hr className={`${styles.divider} ${styles.spacerTop}`} />
        {!address ? (
          <ConnectWallet />
        ) : (
          <>
            <Web3Button
              contractAddress={STAKING_CONTRACT_ADDRESS}
              action={(contract) => contract.call("claimRewards")}
            >
              Claim Rewards
            </Web3Button>
    
            <hr className={`${styles.divider} ${styles.spacerTop}`} />
            <h2>Your Staked NFTs</h2>
            <div className={styles.nftBoxGrid}>
              {stakedNfts?.map((nft, idx) => (
                <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                  {nft?.metadata && (
                    <ThirdwebNftMedia
                      metadata={nft.metadata}
                      className={styles.nftMedia}
                    />
                  )}
                  <h3>{nft.metadata.name}</h3>
                </div>
              ))}
              <Web3Button
                contractAddress={STAKING_CONTRACT_ADDRESS}
                action={(contract) => contract.call("withdrawNFT", [0])}
                // the param passed should be dynamic numbers in the array which will be the tokenid
              >
                Withdraw
              </Web3Button>
            </div>
            <hr className={`${styles.divider} ${styles.spacerTop}`} />
            <h2>Your Unstaked NFTs</h2>
            <div className={styles.nftBoxGrid}>
              {ownedNfts?.map((nft, idx) => (
                <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                  <ThirdwebNftMedia
                    metadata={nft.metadata}
                    className={styles.nftMedia}
                  />
                  <h3>{nft.metadata.name}</h3>
                  <button
                    className={`${styles.mainButton} ${styles.spacerBottom}`}
                    onClick={() => stakeNft(nft.metadata.id)}
                    // onClick={} call stake here with token ids
                  >
                    Stake
                  </button>
                </div>
              ))}
              {/* <Web3Button
                        contractAddress={STAKING_CONTRACT_ADDRESS}
                        action={(contract) => contract.call("stakeNft", [1])}
                        // it would be better if we used the stakeNft function created in the useEffect hook for approval of the NFT from the drop contract as well
                        >
                          Stake
                        </Web3Button> */}
            </div>
          </>
        )}
      </div>
    );
    
    };
    
    export default Stake;