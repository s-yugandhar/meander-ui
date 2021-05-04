import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.span`
  display: inline-flex;
  align-items: center;
  width: 150px;
  max-width: 150px;
  padding: 4px 12px;
  border: 1px solid #bfc9d9;
  border-radius: 4px;

  input[type="color"] {
    margin-right: 8px;
    -webkit-appearance: none;
    border: none;
    width: auto;
    height: auto;
    cursor: pointer;
    background: none;
    outline: none;
    &::-webkit-color-swatch-wrapper {
      padding: 0;
      width: 30px;
      height: 30px;
    }
    &::-webkit-color-swatch {
      border: 1px solid #bfc9d9;
      border-radius: 50px;
      padding: 0;
    }
  }

  input[type="text"] {
    border: none;
    width: 100%;
    font-size: 14px;
  }
`;

const ColorPicker = ({ value, onChange, ...rest }) => {
  return (
    <Container>
      <input type="color" value={value} onChange={onChange} />
      <input type="text" value={value} onChange={onChange} />
    </Container>
  );
};

export default ColorPicker;
