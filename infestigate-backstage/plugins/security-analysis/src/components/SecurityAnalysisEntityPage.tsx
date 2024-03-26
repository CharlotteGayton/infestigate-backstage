import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { securityAnalysisApiRef } from '../api';
import { Header, Page, Progress, TableColumn } from '@backstage/core-components';
import { Grid, Table, makeStyles } from '@material-ui/core';
import useAsync from 'react-use/lib/useAsync';

const useStyles = makeStyles(theme => ({
    container: {
    width: '100%',
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

    const { value } = useAsync(() => securityAnalysisApi.getOverviewSummary());

    if (!value) {
        return <Progress />;
    }

    const columns: TableColumn[] = [
    {
        title: 'Repository Name',
        field: 'repoName',
        highlight: true,
    },
    {
        title: 'Rejected',
        field: 'rejected',
    },
    
    {
        title: 'Unknown',
        field: 'unknown',
    },
    {
        title: 'Accepted',
        field: 'accepted',
    }
    ];

    return (
    <div className={classes.container}>
        <Table
        />
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

export default {
    title: 'Data Display/Table',
    component: Table,
};

