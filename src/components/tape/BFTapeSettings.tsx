import {Flex, Select, SimpleGrid} from "@chakra-ui/react";

interface Props {
  tapeSize: number,
  tapeSizes: number[],
  onChangeSize: (size: number) => void,
}

export default function TapeSettings({ tapeSize, tapeSizes, onChangeSize }: Props ) {
  function getLabel(size: number) {
    return (
        size < 1000
            ? size.toString()
            : Math.floor(size/1000) + 'k'
    )
  }

  function selectSize() {
    return <>
      <div style={{ flexBasis: 'content' }}>
        <Select
            size='md'
            value={tapeSize}
            onChange={handleSelectSize}
        >
          {
            tapeSizes.map((sz) =>
                <option key={sz} value={sz}>{getLabel(sz)}</option>
            )
          }
        </Select>
      </div>
    </>
  }

  function handleSelectSize(e: any) { // TODO correct type
    onChangeSize(
        Number.parseInt(e.target.value)
    )
  }

  return <>
    <div style={{
        height: '35px',
    }}>
      <SimpleGrid columns={3}>
        <div></div>
        <Flex justifyContent='center' alignItems='center'>Memory</Flex>
        <Flex justifyContent='flex-end' alignItems='center'>
          <span style={{ marginRight: '5px' }}></span>
          { selectSize() }
        </Flex>
      </SimpleGrid>
    </div>
  </>
}
