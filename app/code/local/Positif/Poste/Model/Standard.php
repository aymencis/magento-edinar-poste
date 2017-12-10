<?php
 
class Positif_Poste_Model_Standard extends Mage_Payment_Model_Method_Abstract
{
 
protected $_code = 'poste';
protected $_isInitializeNeeded      = true;
protected $_isGateway               = true;
protected $_canUseInternal          = false;
protected $_canUseForMultishipping  = false;

public function getCheckout() {
        return Mage::getSingleton('checkout/session');
    }
//get purchase routine URL
    public function getUrl() {
        return $this->getConfigData('submit_url');
    }
    public function getMerchantId() {
        return $this->getConfigData('merchant_id');
    }
public function getOrderPlaceRedirectUrl()
{
//when you click on place order you will be redirected on this url, if you don't want this action remove this method
return Mage::getUrl('poste/redirect', array('_secure' => true));
}
//get HTML form data
public function getFormFields() {
    $order_id = $this->getCheckout()->getLastRealOrderId();
    $order    = Mage::getModel('sales/order')->loadByIncrementId($order_id);
    $tcoFields = array();
    $tcoFields['nom_commercant'] = $this->getConfigData('merchant_name');
    $tcoFields['nom_client'] = $order->getCustomerName();
    $tcoFields['id_tr'] = sprintf("%020s", $order_id);
    $tcoFields['objet'] = "Commande passé du site HA";
    $tcoFields['url'] = "";
    $tcoFields['carte_edinar'] = "oui";
    //$tcoFields['Montant'] = $amount;
    return $tcoFields;
}
}
