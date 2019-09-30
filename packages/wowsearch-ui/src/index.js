/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2019/9/26
 *
 */
import React from "react";
import Select, { Option, OptGroup } from "rc-select";
import "./index.less";
import { selectPrefix } from "!get-less-vars/loader!./index.less";
import * as PropTypes from "prop-types";
import { robust } from "memoize-fn";
import SearchOption from "./SearchOption";

SearchUI.propTypes = {
  fetcher: PropTypes.func.isRequired
};

export default function SearchUI({ fetcher }) {
  const mFetcher = React.useMemo(() => {
    return robust(fetcher, {});
  }, [fetcher]);

  const [dataSource, setDataSource] = React.useState([]);
  const fetchData = async value => {
    // todo error handler
    const list = await mFetcher(value);
    setDataSource(list.results);
  };

  const onChange = value => {

  };

  let newTitle = ''

  const options = dataSource.map(d => {
    const res = (
      <Option key={d.id}>
        {d.headerTitle !== newTitle && <div className='category-header'>{d.headerTitle}</div>}
        <SearchOption {...d}/>
      </Option>)
    newTitle = d.headerTitle
    return res
  });

  return (
    <Select
      labelInValue
      prefixCls={selectPrefix}
      onSearch={fetchData}
      showSearch
      value={null}
      optionLabelProp="children"
      placeholder="placeholder"
      defaultActiveFirstOption
      style={{ width: 500 }}
      onChange={onChange}
      filterOption={false}
    >
      {options}
    </Select>
  );
}
