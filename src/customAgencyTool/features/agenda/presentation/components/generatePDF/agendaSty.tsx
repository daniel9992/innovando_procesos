import { StyleSheet } from '@react-pdf/renderer';
import { AppConfig } from '@src/customAgencyTool/_appConfig/appConfig';

const companyPrimaryColor = AppConfig.PrimaryColor;

export const styles = StyleSheet.create({
    page: {
        padding: 30
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    logo: {
        // width: 60,
        height: 70
    },
    companyInfo: {
        marginLeft: 10,
        paddingLeft: 10,
        borderLeft: '1px solid #000'
    },
    companyName: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    companyDetail: {
        fontSize: 9,
        color: '#666'
    },
    date: {
        fontSize: 10,
        color: '#666'
    },
    title: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 5
    },
    table: {
        marginVertical: 10
    },
    tableHeader: {
        backgroundColor: '#f4f4f4',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: companyPrimaryColor,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 5
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        padding: 5
    },
    tableCellHeader: {
        flex: 1,
        fontSize: 8,
        padding: 3,
        fontWeight: 'semibold'
    },
    tableCell: {
        flex: 1,
        fontSize: 8,
        padding: 3
    },
    footer: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f9fafb',
        borderRadius: 10,
        padding: 8,
        fontSize: 8,
        color: 'gray'
    },
    providerSection: {
        marginVertical: 5
    },
    providerCard: {
        border: '1px solid #e0e0e0',
        borderRadius: 5,
        padding: 15,
        marginBottom: 5,
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    providerHeader: {
        borderBottom: '2px solid ' + companyPrimaryColor,
        paddingBottom: 10,
        marginBottom: 5
    },
    providerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: companyPrimaryColor
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8
    },
    infoGroup: {
        flex: 1,
        marginHorizontal: 10
    },
    infoLabel: {
        fontSize: 8,
        color: '#666',
        marginBottom: 2
    },
    infoValue: {
        fontSize: 10,
        color: '#333'
    },
    divider: {
        borderBottom: '1px solid #eee',
        marginVertical: 2
    }
});
