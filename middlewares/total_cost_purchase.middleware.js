 const calculateTotalCost = function () {
    this.total_cost = this.items.reduce((total, item) => {
        return total + (item.quantity * item.unit_purchase_cost);
    }, 0);
};
export default calculateTotalCost



export const calculateTotalAmount = function () {
    this.total_amount = this.items.reduce((total, item) => {
        return total + (item.quantity * item.unit_selling_price);
    }, 0);
};


