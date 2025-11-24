import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Table, Upload, Button, message, Space, Modal, Typography } from "antd";
import { UploadOutlined, SendOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text, Title } = Typography;

const ExcelUploaderModal = ({ open, onClose, conviteId }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadKey, setUploadKey] = useState(Date.now());

  const handleFileChange = (info) => {
    const file = info.file.originFileObj || info.fileList?.[0]?.originFileObj;
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (json.length > 0) {
          const cols = Object.keys(json[0]).map((key) => ({
            title: key,
            dataIndex: key,
            key: key,
          }));

          setColumns(cols);
          setData(json);
          message.success(`Ficheiro ${file.name} carregado com sucesso!`);
        } else {
          message.warning("O ficheiro Excel está vazio!");
        }

        setUploadKey(Date.now());
      } catch (err) {
        console.error("Erro ao processar o ficheiro:", err);
        message.error("Erro ao ler o ficheiro Excel!");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (data.length === 0) {
      message.error("Nenhum dado para enviar!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("https://api-qrinvite.technext.ao/api/importConvidado", { data,id:conviteId });

      if (response.data.success) {
        message.success("Dados enviados com sucesso!");
        onClose();
      } else {
        message.warning(response.data.message || "Algo inesperado aconteceu.");
      }

      setData([]);
      setColumns([]);
      setFileName("");
      setUploadKey(Date.now());
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error || "Erro no envio!");
      } else {
        message.error("Erro inesperado ao enviar os dados!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Importar Convidados via Excel"
      open={open}
      onCancel={onClose}
      width={900}
      footer={null}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Upload
          key={uploadKey}
          accept=".xlsx, .xls"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />} type="primary" style={{ background: "#004aad" }}>
            Selecionar ficheiro Excel
          </Button>
        </Upload>

        {fileName && (
          <Text type="success" strong>
            Ficheiro selecionado: {fileName}
          </Text>
        )}

        {data.length > 0 && (
          <>
            <Table
              columns={columns}
              dataSource={data}
              rowKey={(record, index) => index}
              pagination={{ pageSize: 8 }}
              bordered
              size="middle"
            />
            <div style={{ textAlign: "right" }}>
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={loading}
                onClick={handleUpload}
                style={{ background: "#00b96b", border: "none" }}
              >
                Enviar para o servidor
              </Button>
            </div>
          </>
        )}
      </Space>
    </Modal>
  );
};

export default ExcelUploaderModal;
