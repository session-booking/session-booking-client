import {useEffect, useState} from "react";
import {decode as base64_decode} from "base-64";
import {RouteHelper} from "../helpers/RouteHelper";

export const validateUserId = ({encodedId}: { encodedId: string | undefined}) => {
    const [decodedId, setDecodedId] = useState<string | undefined>(undefined);
    const [isUserIdValid, setIsUserIdValid] = useState(false);
    const [loading, setLoading] = useState(true);

    const decoder = new TextDecoder();

    useEffect(() => {
        const checkUserId = async () => {
            if (encodedId) {
                try {
                    const decodedId = decrypt(encodedId);
                    const valid = await RouteHelper.checkUser(decodedId);
                    if (valid) {
                        setDecodedId(decodedId);
                        setIsUserIdValid(true);
                    } else {
                        setIsUserIdValid(false);
                    }
                } catch (err) {
                    setIsUserIdValid(false);
                }
            } else {
                setIsUserIdValid(false);
            }
            setLoading(false);
        }
        checkUserId();
    }, []);

    function fromHex(hex: string): Uint8Array {
        let bytes = [];
        for (let i = 0; i < hex.length; i += 2) {
            bytes.push(parseInt(hex.substring(i, i + 2), 16));
        }
        return new Uint8Array(bytes);
    }

    function decrypt(id: string) {
        const bytes = fromHex(id);
        const base64 = decoder.decode(bytes);
        return base64_decode(base64);
    }

    return {decodedId, isUserIdValid, loading};
}