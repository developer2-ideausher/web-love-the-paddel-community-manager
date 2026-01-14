import React from 'react'
import Select from 'react-select'
import { Label } from '../label'
import { cn } from '@/Utilities/cn'


const MultiSelectOne = ({
    name,
    isMulti = true,
    data,
    position,
    onChange
}) => {
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '48px',
            width: '100%',
            borderRadius: '6px',
            borderColor: state.isFocused ? 'none' : '#e4e4e7',
            paddingRight: '16px',
            paddingLeft: '5px',
            outline: 'none',
            backgroundColor: '#ffffff',
            boxShadow: 'none',
            cursor: 'pointer',
            '&:hover': {
                borderColor: 'none',
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#FBE8EA', 
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#111111',
            fontSize: '14px',
            fontWeight: '400',
        }),
        multiValueRemove: (provided) => ({
            color: '#111111',
            cursor: 'pointer',
            ':hover': {
                backgroundColor: 'gray',
                color: '#111111',
                width: '20px', 
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#71717A',
            fontSize: '14px',
            fontWeight: '400',
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            display: 'none',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#111111',
            svg: {
                strokeWidth: '0.1px',
            },
        }),

    }

  return (
      <>
          <Label
              htmlFor={`label-${name}`}
              className={cn("font-medium text-sm text-black -mb-2")}
          >
              {name}
          </Label>
          <Select
            options={data}
              closeMenuOnSelect={true}
              isMulti={isMulti}
              styles={customStyles}
              menuPlacement={position}
              className='w-full '
              placeholder="Select"
              theme={(theme) => ({
                  ...theme,
                  colors: {
                      ...theme.colors,
                     
                  },
              })}
              onChange={onChange} 
          />
      </>
  )
}

export default MultiSelectOne
