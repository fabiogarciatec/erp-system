import React from 'react';
import { Button, Card, message } from 'antd';
import { usePermissions } from '@/hooks/usePermissions';

const ExemploPermissoes: React.FC = () => {
    const { checkPermission, PermissionGuard } = usePermissions();

    const handleEditClick = async () => {
        const canEdit = await checkPermission('users_edit', 'edit');
        if (canEdit) {
            // Lógica de edição aqui
            message.success('Editando usuário...');
        } else {
            message.error('Você não tem permissão para editar usuários');
        }
    };

    return (
        <Card title="Exemplo de Uso de Permissões">
            {/* Exemplo 1: Usando PermissionGuard para proteger um botão */}
            <PermissionGuard
                permissionName="users_create"
                action="create"
                fallback={<p>Você não tem permissão para criar usuários</p>}
            >
                <Button type="primary">
                    Criar Novo Usuário
                </Button>
            </PermissionGuard>

            {/* Exemplo 2: Usando checkPermission em um evento */}
            <Button 
                onClick={handleEditClick}
                style={{ marginLeft: 8 }}
            >
                Editar Usuário
            </Button>

            {/* Exemplo 3: Protegendo uma seção inteira */}
            <PermissionGuard
                permissionName="dashboard"
                action="view"
            >
                <div style={{ marginTop: 16 }}>
                    <h3>Seção Protegida do Dashboard</h3>
                    <p>Este conteúdo só é visível para quem tem permissão de visualizar o dashboard</p>
                </div>
            </PermissionGuard>
        </Card>
    );
};

export default ExemploPermissoes;
