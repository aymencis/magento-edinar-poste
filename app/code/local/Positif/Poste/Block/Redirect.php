<?php
/*
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 *
 * @category   Payment
 * @package    Poste (poste.tn)
 * @copyright  Copyright (c) 2017 Aymencis
 * @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
class Positif_Poste_Block_Redirect extends Mage_Core_Block_Abstract
{
    protected function _toHtml()
    {
        $postepay = Mage::getModel('poste/standard');
        $form = new Varien_Data_Form();
        $form->setAction($postepay->getUrl())
            ->setId('postepay')
            ->setName('postepay')
            ->setMethod('POST')
            ->setUseContainer(true);
        $postepay->getFormFields();
        foreach ($postepay->getFormFields() as $field=>$value) {
           $form->addField($field, 'hidden', array('name'=>$field, 'value'=>$value, 'size'=>200));
        }
        $form->addField('postesubmit', 'submit', array('name'=>'postesubmit'));
        $html = '<style> #postesubmit {display:none;} </style>';
        $html .= '<div class="poste"><img src='.$this->getSkinUrl("images/logo-la-poste.jpg").' alt=""/><img id="load-img" src='.$this->getSkinUrl("images/opc-ajax-loader.gif").' alt=""/></div>';
        $html .= $form->toHtml();
        $html .= '<script type="text/javascript">document.getElementById("postepay").submit();</script>';
        //$html .= '<script type="text/javascript">function post() { document.getElementById("postepay").submit(); }</script>';
        return $html;
    }
}
?>
