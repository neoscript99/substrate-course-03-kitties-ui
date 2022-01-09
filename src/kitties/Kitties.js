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

  // TODO: react 端组合回需要的数组结构 (3 分)
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
  // TODO: 查询出链上猫咪总数 (3 分)
  // TODO: 查询出链上猫咪的 ID, 所属主人，及其 DNA (4 分)
  const populateKitties = () => {
    let unsub = null;
    const asyncFetch = async () => {
      unsub = await api.query.kittiesModule.kittyCnt(async cnt => {
        console.log('kittyCnt: ', cnt);
        setKittyCnt(cnt.words[0]);
        const entries = await api.query.kittiesModule.kitties.entries();
        setKitties(entries.map(entry => constructKitty(entry)));
      });
    };
    asyncFetch();
    return () => {
      unsub && unsub();
    };
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
