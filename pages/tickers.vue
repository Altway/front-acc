<template>
  
  <div class="row">
  <nuxt keep-alive />
    <div class="col-md-12">
      <card card-body-classes="table-full-width">
        <h4 slot="header" class="card-title">Striped table</h4>
        <el-table :data="tableData">
          <el-table-column
            min-width="150"
            sortable
            label="Name"
            property="name"
          ></el-table-column>
          <el-table-column
            min-width="75"
            sortable
            label="Ticker"
            property="ticker"
          ></el-table-column>
          <el-table-column
            min-width="100"
            sortable
            label="Sector"
            property="sector"
          ></el-table-column>
          <el-table-column
            min-width="150"
            sortable
            align="right"
            header-align="right"
            label="Industry"
            property="industry"
          ></el-table-column>
        </el-table>
      </card>
    </div>
<!--
    <div class="col-md-12">
      <card class="card-plain" body-classes="table-full-width">
        <template slot="header">
          <h4 class="card-title">Table on Plain Background</h4>
          <p class="category">Here is a subtitle for this table</p>
        </template>
        <el-table
          header-cell-class-name="table-transparent"
          header-row-class-name="table-transparent"
          row-class-name="table-transparent"
          :data="tableData"
        >
          <el-table-column
            min-width="150"
            sortable
            label="Name"
            property="name"
          ></el-table-column>
          <el-table-column
            min-width="150"
            sortable
            label="Ticker"
            property="ticker"
          ></el-table-column>
          <el-table-column
            min-width="150"
            sortable
            label="Industry"
            property="industry"
          ></el-table-column>
          <el-table-column
            min-width="150"
            sortable
            align="right"
            header-align="right"
            label="Ticker"
            property="ticker"
          ></el-table-column>
        </el-table>
      </card>
    </div>
    -->
  </div>
</template>
<script>
import { Table, TableColumn } from 'element-ui';

export default {
  data() {
    return {
      tableData: []
    }
  },
  async fetch() {
    this.tableData = await fetch('http://localhost:8000/personnal').then(res => res.json())
  },
  fetchOnServer: false,
  name: 'regular',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
};
</script>
<style>
.table-transparent {
  background-color: transparent !important;
}
</style>
