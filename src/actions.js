// NPM Packages
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { web3, AnchorProvider, Program } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';

// Interface Definition Language (IDL)
import idl from './idl.json';

// Keypair
import kp from './keypair.json';

// Buffer
window.Buffer = Buffer;

// Solana
const programId = new PublicKey(idl.address);
const network = clusterApiUrl('devnet');
const opts = {
  preflightCommitment: 'processed', // 'finalized'
};

// Helpers
function getBaseAccount() {
  const arr = Object.values(kp._keypair.secretKey);
  const secret = new Uint8Array(arr);
  const baseAccount = web3.Keypair.fromSecretKey(secret);

  return baseAccount;
}

function getProgram() {
  const provider = getProvider();
  const program = new Program(idl, provider);

  return program;
}

/*
 * A provider is an authenticated connection to Solana.
 * We pass `window.solana` because we need an authenticated wallet too.
 * You can't communicate with Solana if you don't have an authenticated
 * wallet.
 */
function getProvider() {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new AnchorProvider(
    connection,
    window.solana,
    opts.preflightCommitment
  );

  return provider;
}

/**********
 * Wallet *
 **********/
async function checkIfWalletIsConnected() {
  try {
    const { solana } = window;

    if (solana) {
      if (solana.isPhantom) {
        console.log("Phantom wallet found!");

        const response = await solana.connect({ onlyIfTrusted: true });

        const publicKey = response.publicKey.toString();

        console.log("Connected with Public Key: ", publicKey);

        return publicKey;
      }
    }
    else {
      alert("Solana object not found! Get a Phantom Wallet!");
    }
  }
  catch (error) {
    console.error(error);
  }
}

async function connectWallet() {
  const { solana } = window;

  if (solana) {
    const response = await window.solana.connect();

    const publicKey = response.publicKey.toString();

    return publicKey;
  }
}

/************
 * Accounts *
 ************/
async function createGifAccount() {
  try {
    const provider = getProvider();
    const program = getProgram();
    const baseAccount = getBaseAccount();

    const tx = await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [
        baseAccount,
      ],
    });

    console.log('tx: ', tx);

    console.log("Created a new Base Account w/ address: ", baseAccount.publicKey.toString());
  }
  catch(error) {
    console.log("Error creating BaseAccount account: ", error);
  }
}

/********
 * GIFs *
 ********/
async function createGif(gif) {
  try {
    const provider = getProvider();
    const program = getProgram();
    const baseAccount = getBaseAccount();

    const tx = await program.rpc.addGif(gif.url, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });

    return {
      gif,
      tx,
    };
  }
  catch(error) {
    console.error("Something went wrong creating GIF: ", error);
  }
}

async function listGifs() {
  try {
    const provider = getProvider();
    const program = getProgram();
    const baseAccount = getBaseAccount();

    const account = await program.account.baseAccount
      .fetch(baseAccount.publicKey);

    return account.gifList;
  }
  catch(error) {
    console.error("Something went wrong listing GIFs: ", error);
  }
}

export {
  /**********
   * Wallet *
   **********/
  checkIfWalletIsConnected,
  connectWallet,

  /************
   * Accounts *
   ************/
  createGifAccount,

  /********
   * GIFs *
   ********/
  createGif,
  listGifs,
};
