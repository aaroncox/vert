import fs from "fs";
import path from "path";
import { expect } from "chai";
import { TimePoint } from "@greymass/eosio"
import { Blockchain } from "../../dist";

const blockchain = new Blockchain()

const time = blockchain.createAccount({
  name: 'time',
  wasm: fs.readFileSync(path.join(__dirname, 'timer.wasm')),
  abi: fs.readFileSync(path.join(__dirname, 'timer.abi'), 'utf8')
})

beforeEach(() => {
  blockchain.resetStore()
});

describe('time_test', () => {
  it('check time', async () => {
    await time.actions.exec(['time']).send();
    expect(time.bc.console).to.be.eq("0")

    blockchain.setTime(TimePoint.fromMilliseconds(500))

    await time.actions.exec(['time']).send();
    expect(time.bc.console).to.be.eq("500000")
    
    blockchain.setTime(TimePoint.fromMilliseconds(1000))
    
    await time.actions.exec(['time']).send();
    expect(time.bc.console).to.be.eq("1000000")
  });
});
