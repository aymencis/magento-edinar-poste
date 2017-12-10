<?php
/**
 * Error reporting
 */
if (ob_get_level() == 0) ob_start();
//error_reporting(E_ALL | E_STRICT);

/**
 * Compilation includes configuration file
 */
define('MAGENTO_ROOT', realpath(dirname(__FILE__).'/..' ));

$compilerConfig = MAGENTO_ROOT . '/includes/config.php';
if (file_exists($compilerConfig)) {
    include $compilerConfig;
}

$mageFilename = MAGENTO_ROOT . '/app/Mage.php';

require_once $mageFilename;

if (!Mage::isInstalled()) {
    echo "Application is not installed yet, please complete install wizard first.";
    exit;
}
#Varien_Profiler::enable();

if (isset($_SERVER['MAGE_IS_DEVELOPER_MODE'])) {
    Mage::setIsDeveloperMode(true);
}


/* Store or website code */
$mageRunCode = isset($_SERVER['MAGE_RUN_CODE']) ? $_SERVER['MAGE_RUN_CODE'] : '';

/* Run store or run website */
$mageRunType = isset($_SERVER['MAGE_RUN_TYPE']) ? $_SERVER['MAGE_RUN_TYPE'] : 'store';

Mage::app('admin')->setUseSessionInUrl(false);
umask(0);
$writer = new Zend_Log_Writer_Syslog(array('application' => 'Positif_Poste'));
$writer->setFacility(LOG_USER);
$log = new Zend_Log($writer);
$log->addPriority('TABLE', 8);
$log->info('getcmd2');
/*
script a mettre dans le repertoir pay sur la racine de votre site

de preférence restreindre l'accés a ce repertoir que pour l'adresse locale du site  

*/

error_reporting(0);
// include

$id_tr_cmd=$_GET['id_tr'];
$oId = (int)$_GET['id_tr'];
$auth_id_cmd= $_GET['ref_pay'];
$num_fact_cmd= $_GET['num_fact'];
$montant_cmd= $_GET['montant'];
$order = Mage::getModel('sales/order');
$postepay = Mage::getModel('poste/standard');
try {
	$order->loadByIncrementId($oId);
	if(!$order->canInvoice()) {
		Mage::throwException(Mage::helper('core')->__('Cannot create an invoice.'));
	}
	$invoice = Mage::getModel('sales/service_order', $order)->prepareInvoice();
	if (!$invoice->getTotalQty()) {
		Mage::throwException(Mage::helper('core')->__('Cannot create an invoice without products.'));
	}
	$invoice->setRequestedCaptureCase(Mage_Sales_Model_Order_Invoice::CAPTURE_ONLINE);
	$invoice->register();
	$order->addStatusHistoryComment('Facturé', false);
	$order->addStatusHistoryComment('AUTORISATION CODE : '.$auth_id_cmd, true);
	$order->setCustomerComment('AUTORISATION CODE : '.$auth_id_cmd);
    $order->setCustomerNoteNotify(true);
    $order->setCustomerNote('AUTORISATION CODE : '.$auth_id_cmd);
	$transactionSave = Mage::getModel('core/resource_transaction')
		->addObject($invoice)
		->addObject($invoice->getOrder());
	$transactionSave->save();
	$order->save();
	$order->sendNewOrderEmail();
	$invoice->sendEmail ();
	$invoice->setEmailSent ( true );
	$observer = new Varien_Event_Observer();
	$log->info('location.href = '. Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_WEB).'/checkout/onepage/success');
	echo '<script type="text/javascript">location.href = "'. Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_WEB).'checkout/onepage/success";  </script>';
	exit(0);
} catch(Exception $exc) {
	$log->info($exc->getMessage());
	$log->info('location.href = '. Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_WEB).'/checkout/onepage/failure');
	echo '<script type="text/javascript">location.href = "'. Mage::getBaseUrl(Mage_Core_Model_Store::URL_TYPE_WEB).'checkout/onepage/failure";  </script>';
	exit(0);
}
// mise à jour de la tables commande / paiement 
// en respectant la relation numero_facture , id_transaction, update pour la reference paiement , date_paiement
// 
// affichage de votre reçu

