import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSubstrate } from '../substrate-lib';
import { TxButton } from '../substrate-lib/components';

import KittyCards from './KittyCards';

export default function Kitties (props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  const [kitties, setKitties] = useState([]);
  const [kittyCnt, setKittyCnt] = useState();
  const [status, setStatus] = useState('');

  // const fetchKitties = () => {
  // TODO: 在这里调用 `api.query.kittiesModule.*` 函数去取得猫咪的信息。
  // 你需要取得：
  //   - 共有多少只猫咪
  //   - 每只猫咪的主人是谁
  //   - 每只猫咪的 DNA 是什么，用来组合出它的形态
  // };
  const constructKitty = (entry) => {
    console.debug('kitty entry:', entry);
    const [hash, { value }] = entry;
    const id = `0x${hash.toJSON().slice(-64)}`;
    console.debug('hash:', id);
    const { dna, price, gender, owner } = value;
    console.debug('dna:', dna.toJSON());
    return ({
      id,
      dna: dna,
      price: price.toJSON(),
      gender: gender.toJSON(),
      owner: owner.toJSON()
    });
  };

  const populateKitties = () => {
    // TODO: 在这里添加额外的逻辑。你需要组成这样的数组结构：
    //  ```javascript
    //  const kitties = [{
    //    id: 0,
    //    dna: ...,
    //    owner: ...
    //  }, { id: ..., dna: ..., owner: ... }]
    //  ```
    //api.query.kittiesModule.kittyCnt(setKittyCnt);
    // 这个 kitties 会传入 <KittyCards/> 然后对每只猫咪进行处理
    api.query.kittiesModule.kitties.entries().then(
      (kitties) => setKitties(kitties.map(entry => constructKitty(entry)))
    );
  };

  useEffect(populateKitties, [api, keyring]);

  return <Grid.Column width={16}>
    <h1>小毛孩（总数：{kittyCnt}）</h1>
    <KittyCards kitties={kitties} accountPair={accountPair} setStatus={setStatus}/>
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair} label='创建小毛孩' type='SIGNED-TX' setStatus={setStatus}
          attrs={{
            palletRpc: 'kittiesModule',
            callable: 'createKitty',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>;
}
