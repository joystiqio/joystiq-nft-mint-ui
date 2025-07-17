import React from 'react';
import styled from 'styled-components';
import { color } from '../styles/color';

const Loading = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 4px solid ${color.secondary};
  border-bottom-color: ${color.main};
  animation: rotation 0.75s linear infinite;
  display: inline-block;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loading;
