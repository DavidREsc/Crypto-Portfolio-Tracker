import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    body {

        @media screen and (max-width: 960px) {
            overflow: ${({click}) => (click ? 'hidden' : 'auto')};
        }
    }
`
