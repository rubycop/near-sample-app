use near_sdk::{
    AccountId, BorshStorageKey, env, near_bindgen, setup_alloc, Promise, Balance,
};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::collections::{LookupMap, UnorderedMap};

setup_alloc!();

#[derive(BorshStorageKey, BorshSerialize)]
pub enum StorageKeys {
    Orders,
    UserOrders,
    Approvers,
}

#[derive(PartialEq, Clone, Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub enum Status {
    NotFound,
    Created,
    Approved,
    Paid,
}

#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Order {
    pub id: String,
    pub owner_id: AccountId,
    pub title: String,
    pub spend: String,
    pub price: String,
    pub description: String,
    pub status: Status,
}

impl Clone for Order {
    fn clone(&self) -> Self {
        Order {
            id: self.id.clone(),
            owner_id: self.owner_id.clone(),
            title: self.title.clone(),
            spend: self.spend.clone(),
            price: self.price.clone(),
            description: self.description.clone(),
            status: self.status.clone(),
        }
    }
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    owner_id: AccountId,
    orders: UnorderedMap<String, Order>,
    user_orders: LookupMap<AccountId, Vec<Order>>,
    approvers: UnorderedMap<String, Vec<AccountId>>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            owner_id: env::predecessor_account_id(),
            user_orders: LookupMap::new(StorageKeys::UserOrders),
            orders: UnorderedMap::new(StorageKeys::Orders),
            approvers: UnorderedMap::new(StorageKeys::Approvers),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn view_all_orders(&mut self) -> Vec<Order> {
        self.orders.values().collect()
    }

    pub fn view_my_orders(&mut self) -> Vec<Order> {
        let owner_id = env::predecessor_account_id();

        self.user_orders.get(&owner_id).unwrap_or(vec![])
    }

    pub fn view_approvers(&mut self) -> Vec<(String, Vec<String>)> {
        self.approvers.to_vec()
    }

    pub fn approve_order(&mut self, owner_id: AccountId, order_id: String) {
        let mut approvers = self.approvers.get(&order_id).unwrap_or(vec![]);
        approvers.push(owner_id);

        self.set_order_status(&order_id, Status::Approved);
        self.approvers.insert(&order_id, &approvers);
    }

    pub fn create_order(&mut self,
          title: String,
          spend: String,
          price: String,
          description: String,
        ) -> Vec<Order> {
        let owner_id = env::predecessor_account_id();
        let mut user_orders: Vec<Order> = self.user_orders.get(&owner_id).unwrap_or(vec![]);
        let new_order = Order {
            id: env::block_timestamp().to_string(),
            owner_id: env::signer_account_id(),
            title: title,
            status: Status::Created,
            spend: spend,
            price: price,
            description: description,
        };
        self.orders.insert(&new_order.id, &new_order);
        user_orders.push(new_order.clone());
        self.user_orders.insert(&owner_id, &user_orders);

        user_orders
    }

    pub fn get_balance() -> Balance {
        env::account_balance()
    }

    #[payable]
    pub fn pay_for_order(&mut self, receiver_id: AccountId, order_id: String) -> Promise {
        self.set_order_status(&order_id, Status::Paid);

        Promise::new(receiver_id).transfer(env::attached_deposit())
    }

    pub fn set_order_status(&mut self, order_id: &String, status: Status) {
        let mut order = self.orders.get(order_id).unwrap_or_else(||
            env::panic(b"AccountId is not present")
        );
        order.status = status;
        self.orders.insert(&order_id, &order);
    }

    pub fn to_yocto(&self, tokens: f64) -> Balance {
        let amount = tokens * 10u128.pow(24) as f64;
        amount.to_string().parse().unwrap()
    }
}
