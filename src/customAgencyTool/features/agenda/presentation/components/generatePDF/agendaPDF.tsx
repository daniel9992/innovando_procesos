import { Page, Text, View } from '@react-pdf/renderer';
import type { InterfaceServiceProviderContact } from '@src/customAgencyTool/features/orderTraking/04suppliersControl/domain/sp.model';
import type { InterfaceConfigGeneralOnSave } from '@src/customAgencyTool/features/settings/domain/modelCompany';
import {
    GetToday,
    ShowDate
} from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import ImgTag from '@src/customAgencyTool/utils/pdf/imgTag';
import type { FC } from 'react';
import { GetStringPoliticalDivision } from '../../../domain/contryModel';
import { styles } from './agendaSty';
interface IAgencyInfo {
    title?: string;
    companyInfo: InterfaceConfigGeneralOnSave;
    agendaInfo: InterfaceServiceProviderContact;
}
export const AgendaPDF: FC<IAgencyInfo> = ({
    title = 'Proveedores de Servicios',
    companyInfo,
    agendaInfo
}) => {
    const dateString = ShowDate(GetToday(), 'D [de] MMMM [del] YYYY');

    const hasAccountRecords = agendaInfo.accountRecord.length > 0;
    const hasContactRecords = agendaInfo.customerContact.length > 0;

    const stringPoliticalDivision = GetStringPoliticalDivision(
        agendaInfo.politicalDivision,
        {
            withOutContry: false,
            withName: true,
            separator: ' '
        }
    );

    return (
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoSection}>
                    <ImgTag
                        style={styles.logo}
                        src={companyInfo.companyLogo1}
                    />
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>
                            {companyInfo.companyName}
                        </Text>
                        <Text style={styles.companyDetail}>
                            {companyInfo.companyEmail}
                        </Text>
                        <Text style={styles.companyDetail}>
                            {companyInfo.companyLocation}
                        </Text>
                        <Text style={styles.companyDetail}>
                            {companyInfo.companyPhone}
                        </Text>
                    </View>
                </View>
                <Text style={styles.date}>{dateString}</Text>
            </View>

            {/* Proveedores de Servicios */}
            <View style={styles.providerSection}>
                <Text style={styles.title}>{title}</Text>

                <View style={styles.providerCard}>
                    <View style={styles.providerHeader}>
                        <Text style={styles.providerTitle}>
                            {agendaInfo.clientName}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoGroup}>
                            <Text style={styles.infoLabel}>
                                Tipo de identificación
                            </Text>
                            <Text style={styles.infoValue}>
                                {agendaInfo.typeLegalIdentity}
                            </Text>
                        </View>
                        <View style={styles.infoGroup}>
                            <Text style={styles.infoLabel}>
                                Cédula Jurídica
                            </Text>
                            <Text style={styles.infoValue}>
                                {agendaInfo.legalIdentity}
                            </Text>
                        </View>
                        <View style={styles.infoGroup}>
                            <Text style={styles.infoLabel}>
                                Número de Actividad Económica
                            </Text>
                            <Text style={styles.infoValue}>
                                {agendaInfo.economicActivityNumber}
                            </Text>
                        </View>
                        <View style={styles.infoGroup}>
                            <Text style={styles.infoLabel}>
                                {agendaInfo.internalNumber
                                    ? 'Número Interno'
                                    : ''}
                            </Text>
                            <Text style={styles.infoValue}>
                                {agendaInfo.internalNumber || ''}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoGroup}>
                            <Text style={styles.infoLabel}>
                                Teléfono principal
                            </Text>
                            <Text style={styles.infoValue}>
                                {agendaInfo.phone}
                            </Text>
                        </View>
                        <View style={styles.infoGroup}>
                            <Text style={styles.infoLabel}>
                                Correo Empresarial
                            </Text>
                            <Text style={styles.infoValue}>
                                {agendaInfo.emailForInvoicing}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoGroup}>
                            <Text style={styles.infoLabel}>Dirección</Text>
                            <Text style={styles.infoValue}>
                                {stringPoliticalDivision}
                            </Text>
                            <Text style={styles.infoValue}>
                                {agendaInfo.clientDireccion}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Lista de Cuentas */}
            {hasAccountRecords && (
                <>
                    <Text style={styles.title}>Lista de Cuentas</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableCellHeader}>Banco</Text>
                            <Text style={styles.tableCellHeader}>
                                Número de Cuenta
                            </Text>
                        </View>
                        {agendaInfo.accountRecord.map((account) => (
                            <View style={styles.tableRow} key={account.id}>
                                <Text style={styles.tableCell}>
                                    {account.name}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {account.accountNumber}
                                </Text>
                            </View>
                        ))}
                    </View>
                </>
            )}

            {/* Lista de Contactos */}
            {hasContactRecords && (
                <>
                    <Text style={styles.title}>Lista de Contactos</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableCellHeader}>Nombre</Text>
                            <Text style={styles.tableCellHeader}>
                                Departamento o Rol
                            </Text>
                            <Text style={styles.tableCellHeader}>Email</Text>
                            <Text style={styles.tableCellHeader}>Teléfono</Text>
                        </View>
                        {agendaInfo.customerContact.map((contact) => (
                            <View style={styles.tableRow} key={contact.id}>
                                <Text style={styles.tableCell}>
                                    {contact.name}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {contact.department}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {contact.email.join(', ')}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {contact.phone.join(', ')}
                                </Text>
                            </View>
                        ))}
                    </View>
                </>
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <Text>{companyInfo.companyName}</Text>
                <Text>{companyInfo.companyLocation}</Text>
            </View>
        </Page>
    );
};
