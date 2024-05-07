import { createRedisInstance } from "@/lib/redis_client";
import * as React from "react";
/*!!!!!!!! this code only run on backend so it will bugged out !!!!!!! */
export default function useRedisStorage(
  key: string,
  initialValue: string
): [string, (value: Function | string) => void] {
    const redis = createRedisInstance();

    const [storedValue, setStoredValue] = React.useState(() => {
        try {
            let item: string | null = initialValue;
            const val = redis.get(key) as Promise<string>;
            val.then((value) => {
                if (typeof window !== "undefined" && value) {
                    item = value;
                    //setStoredValue(value);
                }
            });

            return item ? item : initialValue;

        } catch (error) {
            return initialValue;
        }
    });

  const setValue = (value: Function | string) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      redis.set(key, valueToStore);
      //window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}