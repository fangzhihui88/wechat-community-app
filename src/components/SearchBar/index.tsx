import { View, Input, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import './index.css'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  autoFocus?: boolean
}

const SearchBar = memo<SearchBarProps>(({
  placeholder = '搜索',
  onSearch,
  onFocus,
  onBlur,
  autoFocus = false,
}) => {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleInput = useCallback((e: any) => {
    setValue(e.detail.value)
  }, [])

  const handleConfirm = useCallback(() => {
    onSearch?.(value)
    Taro.hideKeyboard()
  }, [onSearch, value])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    onFocus?.()
  }, [onFocus])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    onBlur?.()
  }, [onBlur])

  const handleClear = useCallback(() => {
    setValue('')
  }, [])

  return (
    <View className={`search-bar ${isFocused ? 'search-bar--focused' : ''}`}>
      <View className="search-bar__container">
        <Text className="search-bar__icon">🔍</Text>
        <Input
          className="search-bar__input"
          type="text"
          value={value}
          placeholder={placeholder}
          placeholderClass="search-bar__placeholder"
          onInput={handleInput}
          onConfirm={handleConfirm}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus={autoFocus}
          confirmType="search"
        />
        {value && (
          <View className="search-bar__clear" onClick={handleClear}>
            <Text className="search-bar__clear-icon">✕</Text>
          </View>
        )}
      </View>
    </View>
  )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar
