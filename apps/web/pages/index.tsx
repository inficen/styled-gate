import styled from "styled-components"

const Box = styled.div`
  ${() => ({
    color: "",
  })}
`

export default function Web() {
  return (
    <div>
      <h1>Web</h1>
      <Box>Box</Box>
    </div>
  )
}
