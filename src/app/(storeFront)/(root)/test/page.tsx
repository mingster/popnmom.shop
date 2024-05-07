import { createRedisInstance } from '@/lib/redis_client';
import Redis from 'ioredis';
import axios from 'axios';

import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { corsHeaders } from '@/lib/api_helper';

export default async function testPage() {
  //const session = await getServerSession(authOptions);
  //console.log('session: ' + JSON.stringify(session));
  /*

  const url = process.env.NEXT_PUBLIC_API_URL + '/hello';
  console.log('url: ' + url);

  const response = await fetch(url, {
    method: 'PATCH',
    headers: corsHeaders,
    //mode: 'no-cors',
    body: JSON.stringify({}),
  });

  const data = await response.json();

  console.log('data: ' + JSON.stringify(data));
  return <div className="p-5">{data}</div>;

  return <div className="p-5"></div>;

    const client = new Redis(
    'rediss://default:fdb6bbdcf4e94f89a4c3f540bd0774bc@apn1-tidy-pup-33146.upstash.io:33146',
  );
  await client.set('foo', 'bar');

  const value = await client.get('foo');
  console.log(value);



  const redis = createRedisInstance();
  const key = 'key';
  const data = '1';
  // storing data
  await redis.set(key, data);

  // getting data (using the same key as above)
  const value2 = await redis.get(key);
  console.log('value2: ' + value2);

  // we can also increment a value by <N>
  await redis.incrby(key, 1);

  return <>test</>;
*/
}
