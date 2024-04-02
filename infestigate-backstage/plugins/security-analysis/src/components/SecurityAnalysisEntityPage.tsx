import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { securityAnalysisApiRef } from '../api';
import { Header, InfoCard, Page, Progress, StatusAborted, StatusError, StatusOK, StatusPending, StatusRunning, StatusWarning } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { Table, TableColumn, TableFilter } from '@backstage/core-components';
import { Grid, makeStyles } from '@material-ui/core';

export default {
  title: 'Data Display/Table',
  component: Table,
};

const useStyles = makeStyles(theme => ({
  container: {
    width: 850,
  },
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const OverviewOfAllReposContent = () => {
    const classes = useStyles();
    const securityAnalysisApi = useApi(securityAnalysisApiRef);

    const { value } = useAsync(async () => { return await securityAnalysisApi.getEntitySummary() });

    if (!value) {
        return <Progress />;
    }

    console.log(value)

    const columns = [
          { field: 'severity', title: 'Severity' },
          { field: 'vulnerabilities', title: 'Number of Vulnerabilities' },
        ];

    const data = [
      {
        severity: <StatusError>Critical</StatusError>,
        label: 'Critical',
        vulnerabilities: value.Critical,
      },
      {
        severity: <StatusWarning>High</StatusWarning>,
        vulnerabilities: value.High,
      },
      {
        severity: <StatusPending>Moderate</StatusPending>,
        vulnerabilities: value.Moderate,
      },
      {
        severity: <StatusRunning>Low</StatusRunning>,
        vulnerabilities: value.Low,
      },
      {
        severity: <StatusAborted>Unspecified</StatusAborted>,
        vulnerabilities: value.Undefined,
      },
    ];

    return (
    <div className={classes.container}>
        <InfoCard title="Available status types" noPadding>
            <Table
            options={{
                search: false,
                paging: false,
                toolbar: false,
            }}
            data={data}
            columns={columns}
            />
        </InfoCard>
    </div>)
};

export const SecurityAnalysisOverviewPageContent = () => {
    return(
        <Page themeId="home">
            <Grid container spacing={3} alignItems="stretch" style={{ padding: 20 }}>
            <Grid item md={12}>
                <Header title='SBOM Analysis Overview'/>
            </Grid>    
            <Grid item md={12}>
                <OverviewOfAllReposContent />
            </Grid>
            </Grid>  
        </Page>

    );
};