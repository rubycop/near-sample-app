import {
  CurrencyDollarIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { Row } from "../assets/styles/common.style";
import { Dropdown } from "./Dropdown";
import { Input, TextArea } from "./Form";
import { Modal } from "./Modal";

export const OrdersTable = ({ currentUser }) => {
  const [loading, isLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [showAll, setShowAll] = useState(true);

  const [title, setTitle] = useState();
  const [spend, setSpend] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();

  const statusColorMap = {
    Created: "bg-gray-100 text-gray-800",
    Approved: "bg-blue-100 text-blue-800",
    Paid: "bg-green-100 text-green-800",
  };

  const TableRow = ({ order, index }) => (
    <tr
      index={index}
      className="focus:outline-none h-28 items-center border border-gray-100 rounded"
    >
      <td className="px-5">
        <div>
          <div>
            <div>Order #</div>
            <span className="text-sm font-medium mt-5 leading-none text-gray-500">
              <a
                href={`https://explorer.testnet.near.org/transactions/${order.id}`}
              >
                {order.id}
              </a>
            </span>
          </div>
        </div>
      </td>
      <td className="px-5">
        <div>
          <div>
            <div>{order.title}</div>
            <span className="text-sm font-medium mt-5 leading-none text-gray-500 text-ellipsis overflow-hidden">
              {order.description}
            </span>
          </div>
        </div>
      </td>
      <td className="px-5">
        <div className="flex text-sm items-center">
          <UserIcon className="w-5 h-5" />
          <p className="leading-none text-gray-600 ml-2">{order.owner_id}</p>
        </div>
      </td>
      <td className="px-5">
        <div className="flex text-sm items-center">
          <CurrencyDollarIcon className="w-5 h-5" />
          <p className="leading-none text-gray-600 ml-2">{order.price}</p>
        </div>
      </td>
      <td className="px-5">
        <div
          className={`${
            statusColorMap[order.status]
          } flex items-center justify-center text-sm text-center leading-none p-2 rounded-full`}
        >
          {order.status === "Approved" && approvers?.map(([orderId, approvers]) => (
            <>
              {order.id === orderId && (
                <>
                  <div className="mr-2 rounded-full bg-blue-500 text-white py-1 px-2">
                    {approvers.length}
                  </div>
                </>
              )}
            </>
          ))}
          <span>{order.status}</span>
        </div>
      </td>
      <td className="px-5">
        {approvers.map(([orderId, approvers]) => (
          <>
            {order.id === orderId && (
              <>
                <div className="flex flex-col text-sm">
                  <div className="flex text-sm">
                    <UserGroupIcon className="w-5 h-5 mr-3" />
                    <span>Approvers:</span>
                  </div>
                  <div className="flex flex-col">
                    {approvers.map((accountId) => (
                      <p className="leading-none text-gray-400 mt-1">
                        {accountId}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        ))}
      </td>
      <td>
        <Dropdown
          currentUser={currentUser}
          order={order}
          isLoading={isLoading}
          showAllOrders={showAllOrders}
        />
      </td>
    </tr>
  );

  const handleCreate = async () => {
    isLoading(true);
    const contractOrders = await window.contract.create_order({
      title: title,
      spend: spend,
      price: price,
      description: description,
    });
    setOrders(contractOrders);
    setShowModal(false);
    setShowAll(false);
    isLoading(false);
  };

  const showApprovers = async () => {
    isLoading(true);
    const resp = await window.contract.view_approvers({});
    setApprovers(resp);
    isLoading(false);
  };

  const showAllOrders = async () => {
    isLoading(true);
    const resp = await window.contract.view_all_orders({});
    setOrders(resp);
    setShowAll(true);
    isLoading(false);
  };

  const showMyOrders = async () => {
    isLoading(true);
    const resp = await window.contract.view_my_orders({});
    setOrders(resp);
    setShowAll(false);
    isLoading(false);
  };

  useEffect(() => {
    async function fetchData() {
      showAllOrders();
      showApprovers();
    }
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <>
        <div className="sm:flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={showAllOrders}
              className={`py-2 px-8 ${
                showAll ? "bg-indigo-100 text-indigo-700" : "text-gray-600"
              } rounded-full`}
            >
              <p>All</p>
            </button>
            <button
              onClick={showMyOrders}
              className={`py-2 px-8 ${
                !showAll ? "bg-indigo-100 text-indigo-700" : "text-gray-600"
              } rounded-full`}
            >
              <p>My Orders</p>
            </button>
          </div>
          <button
            className="flex flex-row items-center text-white p-3 px-5 rounded-full bg-orange-600"
            onClick={() => setShowModal(true)}
          >
            <Row className="justify-between">
              Create Requisition
              <PlusIcon className="ml-3 h-5 w-5" />
            </Row>
          </button>
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            onSubmit={handleCreate}
            loading={loading}
          >
            <div className="block p-6">
              <div className="form-group mb-6">
                <Input
                  placeholder="Title"
                  val={title}
                  handleChange={setTitle}
                />
              </div>
              <div className="form-group flex mb-6 space-x-4">
                <Input
                  placeholder="Spend Type"
                  val={spend}
                  handleChange={setSpend}
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Price"
                  val={price}
                  handleChange={setPrice}
                />
              </div>
              <div className="form-group mb-6">
                <TextArea
                  placeholder="Description..."
                  val={description}
                  handleChange={setDescription}
                />
              </div>
            </div>
          </Modal>
        </div>
        {loading ? (
          <div className="w-full my-5 mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-200 h-10 w-10"></div>
              <div className="flex-1 space-y-8 py-2">
                <div className="h-2 bg-slate-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="flex-1 space-y-8 py-2">
                <div className="h-2 bg-slate-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-7 h-screen">
            <table className="w-full whitespace-nowrap">
              <tbody>
                {orders?.map((order, index) => (
                  <TableRow order={order} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    </div>
  );
};
