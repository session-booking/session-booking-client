import React, {useState} from 'react';
import {FaCopy} from 'react-icons/fa';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import styled, {keyframes, css} from 'styled-components';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/state/store";
import LogApi from "../../api/LogApi";
import {encode as base64_encode} from 'base-64';

function QRContent() {
    const [copied, setCopied] = useState(false);
    const userId = useSelector((state: RootState) => state.user.id);
    const encoder = new TextEncoder();

    const spin = keyframes`
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    `;

    type ButtonProps = {
        copied: boolean;
    };

    const Button = styled.button<ButtonProps>`
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      background: #f1f1f1;
      border: 1px solid black;
      color: black;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
      margin: 20px;

      &:hover {
        background: #e1e1e1;
      }

      svg {
        margin-right: 5px;
        animation: ${(props) => (props.copied ? css`${spin} 0.5s linear` : 'none')};
      }
    `;

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    function toHex(bytes: Uint8Array): string {
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function getSessionBookingURL() {
        if (userId != null) {
            return window.location.origin + "/book/" + toHex(encoder.encode(base64_encode(String(userId))));
        } else {
            LogApi.logError("User ID is null", null);
            return "";
        }
    }

    return (
        <div className="flex justify-center">
            <CopyToClipboard text={getSessionBookingURL()} onCopy={handleCopy}>
                <Button copied={copied}>
                    <FaCopy size={16}/>
                    <p className="font-light">{copied ? "Copied!" : "Copy Booking URL"}</p>
                </Button>
            </CopyToClipboard>
        </div>
    );
}

export default QRContent;
